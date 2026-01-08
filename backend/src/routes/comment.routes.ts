import { Router } from 'express';
import { body } from 'express-validator';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation
const commentValidation = [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
];

// Routes
router.post('/task/:taskId', commentValidation, createComment as any);
router.get('/task/:taskId', getComments as any);
router.put('/:id', commentValidation, updateComment as any);
router.delete('/:id', deleteComment as any);

export default router;








