import { Router } from 'express';
import { searchUsers } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/search', searchUsers as any);

export default router;






