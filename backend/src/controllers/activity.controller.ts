import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { getParam } from '../utils/route-params';

export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = getParam(req, 'projectId');
    const taskId = req.query.taskId as string | undefined;
    const limit = Number(req.query.limit || 50);
    const userId = req.userId!;

    // Verify user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
    });

    if (!project) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const where: any = {
      projectId,
    };

    if (taskId) {
      where.taskId = taskId;
    }

    const logs = await prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    res.json({ logs });
  } catch (error: any) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch activity logs' } });
  }
};

// Helper function to create activity log
export const createActivityLog = async (
  type: string,
  description: string,
  projectId: string,
  userId: string,
  taskId?: string,
  metadata?: any
) => {
  try {
    const log = await prisma.activityLog.create({
      data: {
        type: type as any,
        description,
        projectId,
        userId,
        taskId: taskId || null,
        metadata: metadata || null,
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
    const io = (global as any).io;
    if (io) {
      io.to(`project:${projectId}`).emit('activity:created', log);
    }

    return log;
  } catch (error: any) {
    console.error('Create activity log error:', error);
    // Don't throw - activity logs are not critical
    return null;
  }
};





