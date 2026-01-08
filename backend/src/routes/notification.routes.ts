import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getNotifications as any);
router.get('/unread-count', getUnreadCount as any);
router.put('/:id/read', markAsRead as any);
router.put('/read-all', markAllAsRead as any);
router.delete('/:id', deleteNotification as any);

export default router;






