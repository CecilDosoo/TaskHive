import { Router } from 'express';
import { body } from 'express-validator';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation
const projectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
];

// Routes
router.post('/', projectValidation, createProject as any);
router.get('/', getProjects as any);
router.get('/:id', getProject as any);
router.put('/:id', projectValidation, updateProject as any);
router.delete('/:id', deleteProject as any);

export default router;











