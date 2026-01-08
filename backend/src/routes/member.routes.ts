import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProjectMembers,
  inviteMember,
  updateMemberRole,
  removeMember,
  leaveProject,
} from '../controllers/member.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation
const inviteMemberValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('role').isIn(['ADMIN', 'MEMBER', 'VIEWER']).withMessage('Invalid role'),
];

const updateRoleValidation = [
  body('role').isIn(['ADMIN', 'MEMBER', 'VIEWER']).withMessage('Invalid role'),
];

// Routes
router.get('/project/:id', getProjectMembers);
router.post('/project/:id/invite', inviteMemberValidation, inviteMember);
router.put('/project/:id/member/:userId', updateRoleValidation, updateMemberRole);
router.delete('/project/:id/member/:userId', removeMember);
router.post('/project/:id/leave', leaveProject);

export default router;






