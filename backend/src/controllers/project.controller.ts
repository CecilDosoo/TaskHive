import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { getUserProjectRole, canEditProject, canDeleteProject, canManageMembers } from '../utils/permissions';
import { createActivityLog } from './activity.controller';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, color } = req.body;
    const userId = req.userId!;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        color,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
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

    // Create activity log
    await createActivityLog(
      'PROJECT_CREATED',
      `Created project "${project.name}"`,
      project.id,
      userId
    );

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${project.id}`).emit('project:created', project);

    res.status(201).json({ project });
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({ error: { message: 'Failed to create project' } });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
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
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.json({ projects });
  } catch (error: any) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch projects' } });
  }
};

export const getProject = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.userId!;

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
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
        taskLists: {
          orderBy: {
            order: 'asc',
          },
          include: {
            tasks: {
              orderBy: {
                order: 'asc',
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
            },
          },
        },
        // FIXED: Fetch ALL tasks for the project, not just those with taskListId: null
        tasks: {
          orderBy: {
            order: 'asc',
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
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    // Debug logging
    console.log('=== GET PROJECT DEBUG ===');
    console.log('Project ID:', project.id);
    console.log('Project name:', project.name);
    console.log('TaskLists count:', project.taskLists?.length || 0);
    console.log('Direct tasks count:', project.tasks?.length || 0);
    if (project.taskLists && project.taskLists.length > 0) {
      project.taskLists.forEach((list, i) => {
        console.log(`TaskList ${i}: ${list.name}, tasks count: ${list.tasks?.length || 0}`);
      });
    }
    if (project.tasks && project.tasks.length > 0) {
      console.log('Direct tasks:', project.tasks.map(t => ({ id: t.id, title: t.title, taskListId: t.taskListId, status: t.status })));
    }
    console.log('========================');

    // Get user's role in this project
    const userRole = await getUserProjectRole(userId, id);

    res.json({ 
      project,
      userRole: userRole.role,
      permissions: {
        canEdit: userRole.isOwner || userRole.isAdmin,
        canDelete: userRole.isOwner,
        canManageMembers: userRole.isOwner || userRole.isAdmin,
      },
    });
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch project' } });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, color } = req.body;
    const userId = req.userId!;

    // Check if user can edit project
    if (!(await canEditProject(userId, id))) {
      return res.status(403).json({ error: { message: 'You do not have permission to edit this project' } });
    }

    // Verify project exists
    const project = await prisma.project.findFirst({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    const changes: string[] = [];
    if (name && name !== project.name) {
      changes.push(`name from "${project.name}" to "${name}"`);
    }
    if (description !== undefined && description !== project.description) {
      changes.push('description');
    }
    if (color && color !== project.color) {
      changes.push('color');
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        color,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
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

    // Create activity log
    if (changes.length > 0) {
      await createActivityLog(
        'PROJECT_UPDATED',
        `Updated project "${updatedProject.name}": ${changes.join(', ')}`,
        id,
        userId
      );
    }

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${id}`).emit('project:updated', updatedProject);

    res.json({ project: updatedProject });
  } catch (error: any) {
    console.error('Update project error:', error);
    res.status(500).json({ error: { message: 'Failed to update project' } });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.userId!;

    // Check if user can delete project
    if (!(await canDeleteProject(userId, id))) {
      return res.status(403).json({ error: { message: 'Only the project owner can delete the project' } });
    }

    // Verify project exists
    const project = await prisma.project.findFirst({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    const projectName = project.name;

    await prisma.project.delete({
      where: { id },
    });

    // Note: Activity log won't be created here since project is deleted
    // But we could log it before deletion if needed

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${id}`).emit('project:deleted', { id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: { message: 'Failed to delete project' } });
  }
};