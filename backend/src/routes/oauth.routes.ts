import { Router } from 'express';
import { googleAuth, googleCallback } from '../controllers/oauth.controller';

const router = Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', ...googleCallback);

export default router;

