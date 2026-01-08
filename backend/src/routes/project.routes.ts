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
router.post('/', projectValidation, createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', projectValidation, updateProject);
router.delete('/:id', deleteProject);

export default router;











