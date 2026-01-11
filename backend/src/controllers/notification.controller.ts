import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { sendNotificationEmail } from '../services/email.service';

/**
 * Get all notifications for the current user
 */
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { read } = req.query;

    const where: any = { userId };
    if (read !== undefined) {
      where.read = read === 'true';
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 most recent
    });

    res.json({ notifications });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch notifications' } });
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    res.json({ count });
  } catch (error: any) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch unread count' } });
  }
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.userId!;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ error: { message: 'Notification not found' } });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`user:${userId}`).emit('notification:read', { id });

    res.json({ notification: updated });
  } catch (error: any) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: { message: 'Failed to mark notification as read' } });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`user:${userId}`).emit('notifications:allRead');

    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: { message: 'Failed to mark all notifications as read' } });
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.userId!;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ error: { message: 'Notification not found' } });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    await prisma.notification.delete({
      where: { id },
    });

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`user:${userId}`).emit('notification:deleted', { id });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: { message: 'Failed to delete notification' } });
  }
};

/**
 * Helper function to create a notification
 * This can be called from other controllers
 */
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  io?: any,
  actionUrl?: string,
  actionText?: string
) => {
  try {
    // Get user info for email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
      },
    });

    if (!user) {
      console.error('User not found for notification:', userId);
      return null;
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });

    // Emit real-time update if io is provided
    if (io) {
      io.to(`user:${userId}`).emit('notification:created', notification);
    }

    // Send email notification if user has verified email
    if (user.emailVerified && user.email) {
      try {
        await sendNotificationEmail(
          user.email,
          user.name,
          title,
          title,
          message,
          actionUrl,
          actionText
        );
        console.log('✅ Email notification sent to:', user.email);
      } catch (emailError) {
        console.error('⚠️ Failed to send email notification:', emailError);
        // Don't fail the notification creation if email fails
      }
    }

    return notification;
  } catch (error: any) {
    console.error('Create notification error:', error);
    // Don't throw - notifications are non-critical
    return null;
  }
};


