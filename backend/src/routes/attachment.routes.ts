import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadAttachment,
  getAttachments,
  deleteAttachment,
} from '../controllers/attachment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now (can be restricted later)
    cb(null, true);
  },
});

// Routes
router.post('/task/:taskId', upload.single('file'), uploadAttachment);
router.get('/task/:taskId', getAttachments);
router.delete('/:id', deleteAttachment);

export default router;

