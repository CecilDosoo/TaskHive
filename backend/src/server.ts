// Load environment variables (only in development, Railway provides them in production)
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

// Debug: Check all environment variables (for Railway debugging)
console.log('🔍 Environment Variables Check:');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('  PORT:', process.env.PORT || 'NOT SET');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 50)}...` : 'UNDEFINED ❌');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✅' : 'UNDEFINED ❌');
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');

// List all PG* variables (Railway might use these instead)
const pgVars = Object.keys(process.env).filter(key => key.startsWith('PG'));
if (pgVars.length > 0) {
  console.log('  Found PG* variables:', pgVars.join(', '));
  // Try to construct DATABASE_URL from PG* variables if DATABASE_URL is missing
  if (!process.env.DATABASE_URL && process.env.PGHOST) {
    const pgUrl = `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || 'railway'}${process.env.PGSSLMODE ? `?sslmode=${process.env.PGSSLMODE}` : ''}`;
    process.env.DATABASE_URL = pgUrl;
    console.log('  ✅ Constructed DATABASE_URL from PG* variables');
  }
} else {
  console.log('  No PG* variables found');
}

// Final check
if (!process.env.DATABASE_URL) {
  console.error('\n❌ CRITICAL: DATABASE_URL is still not set!');
  console.error('❌ This means Railway is not passing environment variables to your app.');
  console.error('❌ Possible fixes:');
  console.error('   1. Check if services are linked (PostgreSQL → Backend)');
  console.error('   2. Verify Root Directory is set to "backend" in Settings → Deploy');
  console.error('   3. Try redeploying after ensuring DATABASE_URL is in Variables');
  console.error('   4. Check Railway plan/limits for environment variables');
} else {
  console.log('\n✅ DATABASE_URL is available!');
}
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth.routes';
import oauthRoutes from './routes/oauth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import commentRoutes from './routes/comment.routes';
import attachmentRoutes from './routes/attachment.routes';
import memberRoutes from './routes/member.routes';
import userRoutes from './routes/user.routes';
import notificationRoutes from './routes/notification.routes';
import activityRoutes from './routes/activity.routes';

// Load environment variables


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'taskhive-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskHive API is running' });
});

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', activityRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle user authentication and join user room
  socket.on('authenticate', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} authenticated as user ${userId}`);
  });

  socket.on('join-project', (projectId: string) => {
    socket.join(`project:${projectId}`);
    console.log(`Socket ${socket.id} joined project ${projectId}`);
  });

  socket.on('leave-project', (projectId: string) => {
    socket.leave(`project:${projectId}`);
    console.log(`Socket ${socket.id} left project ${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available to routes via app.locals
app.locals.io = io;
(global as any).io = io;

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export { io };




