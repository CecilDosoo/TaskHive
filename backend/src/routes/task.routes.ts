import { Router } from 'express';
import { body } from 'express-validator';
import {
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  unassignTask,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation
const taskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('projectId').notEmpty().withMessage('Project ID is required'),
];

// Routes
router.post('/', taskValidation, createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/assign', body('userId').notEmpty(), assignTask);
router.post('/:id/unassign', body('userId').notEmpty(), unassignTask);

export default router;











