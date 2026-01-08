import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { hasPermission } from '../utils/permissions';
import { createNotification } from './notification.controller';

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.userId!;

    // Verify task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    // Check if user can add comments
    if (!(await hasPermission(userId, task.projectId, 'add_comment'))) {
      return res.status(403).json({ error: { message: 'You do not have permission to add comments' } });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
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

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${task.projectId}`).emit('comment:created', comment);

    // Create notifications for task assignees (excluding comment author)
    const taskWithAssignments = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    if (taskWithAssignments) {
      for (const assignment of taskWithAssignments.assignments) {
        if (assignment.user.id !== userId) {
          await createNotification(
            assignment.user.id,
            'New Comment',
            `${comment.user.name} commented on task "${taskWithAssignments.title}" in project "${taskWithAssignments.project.name}"`,
            'comment',
            io
          );
        }
      }
    }

    res.status(201).json({ comment });
  } catch (error: any) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: { message: 'Failed to create comment' } });
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId!;

    // Verify task exists and user has access
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    // Verify user has access to task's project
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

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json({ comments });
  } catch (error: any) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch comments' } });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId!;

    // Verify comment exists and belongs to user
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        task: {
          include: { project: true },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ error: { message: 'Comment not found' } });
    }

    // Only the comment author can update it
    if (comment.userId !== userId) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
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

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${comment.task.projectId}`).emit('comment:updated', updatedComment);

    res.json({ comment: updatedComment });
  } catch (error: any) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: { message: 'Failed to update comment' } });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // Verify comment exists
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        task: {
          include: { project: true },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ error: { message: 'Comment not found' } });
    }

    // Check if user can delete this comment
    const { canDeleteComment } = await import('../utils/permissions');
    if (!(await canDeleteComment(userId, comment.task.projectId, comment.userId))) {
      return res.status(403).json({ error: { message: 'You do not have permission to delete this comment' } });
    }

    const projectId = comment.task.projectId;

    await prisma.comment.delete({
      where: { id },
    });

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${projectId}`).emit('comment:deleted', { id, taskId: comment.taskId });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: { message: 'Failed to delete comment' } });
  }
};



