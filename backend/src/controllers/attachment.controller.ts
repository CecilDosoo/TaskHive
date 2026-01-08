import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists (relative to project root)
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const uploadAttachment = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId!;

    if (!req.file) {
      return res.status(400).json({ error: { message: 'No file uploaded' } });
    }

    // Verify task exists and user has access
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      // Delete uploaded file if task doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    // Check if user can upload attachments
    if (!(await hasPermission(userId, task.projectId, 'upload_attachment'))) {
      // Delete uploaded file if access denied
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: { message: 'You do not have permission to upload attachments' } });
    }

    // Create attachment record
    const attachment = await prisma.attachment.create({
      data: {
        filename: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        taskId,
      },
    });

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${task.projectId}`).emit('attachment:created', attachment);

    res.status(201).json({ attachment });
  } catch (error: any) {
    console.error('Upload attachment error:', error);
    // Clean up file if error occurred
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: { message: 'Failed to upload attachment' } });
  }
};

export const getAttachments = async (req: AuthRequest, res: Response) => {
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

    const attachments = await prisma.attachment.findMany({
      where: { taskId },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    res.json({ attachments });
  } catch (error: any) {
    console.error('Get attachments error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch attachments' } });
  }
};

export const deleteAttachment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // Verify attachment exists
    const attachment = await prisma.attachment.findUnique({
      where: { id },
      include: {
        task: {
          include: { project: true },
        },
      },
    });

    if (!attachment) {
      return res.status(404).json({ error: { message: 'Attachment not found' } });
    }

    // Check if user can delete attachments
    if (!(await hasPermission(userId, attachment.task.projectId, 'delete_attachment'))) {
      return res.status(403).json({ error: { message: 'You do not have permission to delete attachments' } });
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), attachment.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const projectId = attachment.task.projectId;
    const taskId = attachment.taskId;

    // Delete attachment record
    await prisma.attachment.delete({
      where: { id },
    });

    // Emit real-time update
    const io = req.app.locals.io;
    io.to(`project:${projectId}`).emit('attachment:deleted', { id, taskId });

    res.json({ message: 'Attachment deleted successfully' });
  } catch (error: any) {
    console.error('Delete attachment error:', error);
    res.status(500).json({ error: { message: 'Failed to delete attachment' } });
  }
};

