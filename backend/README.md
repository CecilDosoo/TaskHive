# TaskHive Backend API

Backend API for TaskHive - A team task management application.

## Tech Stack

- **Node.js** + **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **Socket.IO** - Real-time updates
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS

3. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Projects
- `POST /api/projects` - Create a project (requires auth)
- `GET /api/projects` - Get all user's projects (requires auth)
- `GET /api/projects/:id` - Get project by ID (requires auth)
- `PUT /api/projects/:id` - Update project (requires auth)
- `DELETE /api/projects/:id` - Delete project (requires auth)

### Tasks
- `POST /api/tasks` - Create a task (requires auth)
- `PUT /api/tasks/:id` - Update task (requires auth)
- `DELETE /api/tasks/:id` - Delete task (requires auth)
- `POST /api/tasks/:id/assign` - Assign task to user (requires auth)
- `POST /api/tasks/:id/unassign` - Unassign task from user (requires auth)

## Database Schema

The database includes models for:
- Users
- Projects
- Project Members (with roles: ADMIN, MEMBER, VIEWER)
- Task Lists
- Tasks (with status: TODO, IN_PROGRESS, DONE)
- Task Assignments
- Comments
- Attachments
- Notifications

## Real-time Updates

Socket.IO is configured for real-time updates. Clients can:
- Join a project room: `socket.emit('join-project', projectId)`
- Receive updates for: project created/updated/deleted, task created/updated/deleted/assigned

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:migrate` - Create and run migrations











