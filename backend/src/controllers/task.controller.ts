import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { canCreateTask, canAccessProject } from '../utils/permissions';
import { createNotification } from './notification.controller';
import { createActivityLog } from './activity.controller';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, dueDate, projectId, taskListId } = req.body;
    const userId = req.userId!;

    // Check if user can create tasks in this project
    if (!(await canCreateTask(userId, projectId))) {
      return res.status(403).json({ error: { message: 'You do not have permission to create tasks' } });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: 'TODO', // Default status
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        taskListId: taskListId || null,
        order: 0, // Default order
      },
      include: {
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${projectId}`).emit('task:created', task);

    // Create activity log
    await createActivityLog(
      'TASK_CREATED',
      `Created task "${task.title}"`,
      projectId,
      userId,
      task.id
    );

    // Create notifications for assigned users
    if (task.assignments && task.assignments.length > 0) {
      for (const assignment of task.assignments) {
        if (assignment.user.id !== userId) {
          await createNotification(
            assignment.user.id,
            'New Task Assigned',
            `You have been assigned to task "${task.title}" in project "${project.name}"`,
            'task_assigned',
            io
          );
        }
      }
    }

    res.status(201).json({ task });
  } catch (error: any) {
    console.error('Create task error:', error);
    res.status(500).json({ error: { message: 'Failed to create task' } });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, taskListId, order } = req.body;
    const userId = req.userId!;

    // Get task and check permissions
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    // Check if user can edit tasks in this project
    const { canEditTask } = await import('../utils/permissions');
    if (!(await canEditTask(userId, task.projectId))) {
      return res.status(403).json({ error: { message: 'You do not have permission to edit tasks' } });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(taskListId !== undefined && { taskListId }),
        ...(order !== undefined && { order }),
      },
      include: {
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Create activity logs for specific changes
    const changes: string[] = [];
    if (title && title !== task.title) {
      changes.push(`title from "${task.title}" to "${title}"`);
    }
    if (status && status !== task.status) {
      changes.push(`status from ${task.status} to ${status}`);
      await createActivityLog(
        'TASK_STATUS_CHANGED',
        `Changed task "${updatedTask.title}" status from ${task.status} to ${status}`,
        task.projectId,
        userId,
        task.id,
        { oldStatus: task.status, newStatus: status }
      );
    }
    if (priority && priority !== task.priority) {
      changes.push(`priority from ${task.priority} to ${priority}`);
      await createActivityLog(
        'TASK_PRIORITY_CHANGED',
        `Changed task "${updatedTask.title}" priority from ${task.priority} to ${priority}`,
        task.projectId,
        userId,
        task.id,
        { oldPriority: task.priority, newPriority: priority }
      );
    }
    if (description !== undefined && description !== task.description) {
      changes.push('description');
    }
    if (dueDate !== undefined) {
      const oldDueDate = task.dueDate ? new Date(task.dueDate).toISOString() : null;
      const newDueDate = dueDate ? new Date(dueDate).toISOString() : null;
      if (oldDueDate !== newDueDate) {
        changes.push('due date');
      }
    }

    if (changes.length > 0 && !status && !priority) {
      await createActivityLog(
        'TASK_UPDATED',
        `Updated task "${updatedTask.title}": ${changes.join(', ')}`,
        task.projectId,
        userId,
        task.id
      );
    }

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${task.projectId}`).emit('task:updated', updatedTask);

    res.json({ task: updatedTask });
  } catch (error: any) {
    console.error('Update task error:', error);
    res.status(500).json({ error: { message: 'Failed to update task' } });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    // Check if user can delete tasks in this project
    const { canDeleteTask } = await import('../utils/permissions');
    if (!(await canDeleteTask(userId, task.projectId))) {
      return res.status(403).json({ error: { message: 'You do not have permission to delete tasks' } });
    }

    const taskTitle = task.title;
    const projectId = task.projectId;

    await prisma.task.delete({
      where: { id },
    });

    // Create activity log
    await createActivityLog(
      'TASK_DELETED',
      `Deleted task "${taskTitle}"`,
      projectId,
      userId,
      id
    );

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${projectId}`).emit('task:deleted', { id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: { message: 'Failed to delete task' } });
  }
};

export const assignTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: assignUserId } = req.body;
    const userId = req.userId!;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    // Verify user has access and assignee is project member
    const hasAccess = await prisma.project.findFirst({
      where: {
        id: task.projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        members: {
          where: {
            userId: assignUserId,
          },
        },
      },
    });

    if (!hasAccess) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    if (hasAccess.members.length === 0 && hasAccess.ownerId !== assignUserId) {
      return res.status(400).json({ error: { message: 'User is not a project member' } });
    }

    const assignment = await prisma.taskAssignment.upsert({
      where: {
        taskId_userId: {
          taskId: id,
          userId: assignUserId,
        },
      },
      update: {},
      create: {
        taskId: id,
        userId: assignUserId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create activity log
    await createActivityLog(
      'TASK_ASSIGNED',
      `Assigned task "${task.title}" to ${assignment.user.name}`,
      task.projectId,
      userId,
      task.id,
      { assigneeId: assignUserId, assigneeName: assignment.user.name }
    );

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${task.projectId}`).emit('task:assigned', assignment);

    // Create notification for assigned user (if not the current user)
    if (assignUserId !== userId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignUserId },
      });
      const project = await prisma.project.findUnique({
        where: { id: task.projectId },
      });
      
      if (assignedUser && project) {
        await createNotification(
          assignUserId,
          'Task Assigned',
          `You have been assigned to task "${task.title}" in project "${project.name}"`,
          'task_assigned',
          io
        );
      }
    }

    res.json({ assignment });
  } catch (error: any) {
    console.error('Assign task error:', error);
    res.status(500).json({ error: { message: 'Failed to assign task' } });
  }
};

export const unassignTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: unassignUserId } = req.body;
    const userId = req.userId!;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    const hasAccess = await prisma.project.findFirst({
      where: {
        id: task.projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
    });

    if (!hasAccess) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    // Get unassignee user info for activity log
    const unassigneeUser = await prisma.user.findUnique({
      where: { id: unassignUserId },
      select: { name: true },
    });

    await prisma.taskAssignment.deleteMany({
      where: {
        taskId: id,
        userId: unassignUserId,
      },
    });

    // Create activity log
    await createActivityLog(
      'TASK_UNASSIGNED',
      `Unassigned task "${task.title}" from ${unassigneeUser?.name || 'user'}`,
      task.projectId,
      userId,
      task.id,
      { unassigneeId: unassignUserId, unassigneeName: unassigneeUser?.name }
    );

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${task.projectId}`).emit('task:unassigned', { taskId: id, userId: unassignUserId });

    res.json({ message: 'Task unassigned successfully' });
  } catch (error: any) {
    console.error('Unassign task error:', error);
    res.status(500).json({ error: { message: 'Failed to unassign task' } });
  }
};




