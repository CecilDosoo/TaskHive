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
router.post('/task/:taskId', commentValidation, createComment);
router.get('/task/:taskId', getComments);
router.put('/:id', commentValidation, updateComment);
router.delete('/:id', deleteComment);

export default router;








