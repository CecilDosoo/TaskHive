# TaskHive

TaskHive is a full-stack team task management platform with real-time collaboration, role-based access control, and email verification.

## Features

- Secure authentication with JWT + email verification
- Project/workspace management with member roles (owner/admin/member/viewer)
- Kanban-style task workflows with priorities, assignments, and due dates
- Comments, file attachments, notifications, and activity logs
- Real-time updates via Socket.IO (project/task events)
- Responsive UI with search, filtering, and sorting

## Tech Stack

**Frontend**
- React, TypeScript, Vite
- React Router, Axios, TanStack Query
- Tailwind CSS
- Socket.IO client
- DnD Kit

**Backend**
- Node.js, Express, TypeScript
- Prisma ORM + PostgreSQL
- Socket.IO
- JWT + bcryptjs
- Multer (file uploads)
- SendGrid Web API (transactional email delivery)

**Deployment**
- Vercel (frontend)
- Railway (backend + database)

## Project Structure

```
taskhive2/
  frontend/   # React app
  backend/    # Express API
```

## Getting Started (Local)

### 1) Backend

```bash
cd backend
npm install

# Generate Prisma client and run migrations
npm run prisma:generate
npm run prisma:migrate

# Start dev server
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3) Environment Variables

Create a `backend/.env` file:

```
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
# Or allow multiple origins (comma-separated)
FRONTEND_URLS=http://localhost:5173,https://your-frontend-domain

# Email (SendGrid Web API)
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SMTP_FROM=TaskHive <you@example.com>
```

Create a `frontend/.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Scripts

**Backend**
- `npm run dev` – start dev server
- `npm run build` – build TypeScript
- `npm start` – start production server
- `npm run prisma:migrate` – run migrations

**Frontend**
- `npm run dev` – start dev server
- `npm run build` – build production assets
- `npm run preview` – preview production build

## Deployment Notes

### Backend (Railway)

- Set `ROOT DIRECTORY` to `backend` in Railway deploy settings.
- Add env vars in Railway:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `FRONTEND_URL` or `FRONTEND_URLS`
  - `SENDGRID_API_KEY`
  - `SMTP_FROM`
- Railway runs:
  - build: `npm install && npm run prisma:generate && npm run build`
  - start: `npm run start`

### Frontend (Vercel)

- Set `VITE_API_URL` to your Railway backend:
  - `https://your-backend.railway.app/api`
- Redeploy after updating env vars.

## Real-Time Collaboration

The backend uses Socket.IO. Clients join project rooms and receive live updates for task and project events.

## Email Verification

Email delivery uses the SendGrid Web API. Verify the sender identity in SendGrid and set `SMTP_FROM` to that verified email.
