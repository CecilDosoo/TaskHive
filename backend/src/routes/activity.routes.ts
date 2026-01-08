import { Router } from 'express';
import { getActivityLogs } from '../controllers/activity.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/projects/:projectId/activity', authenticate, getActivityLogs as any);

export default router;





