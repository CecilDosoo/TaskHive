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

## Real-Time Collaboration

The backend uses Socket.IO. Clients join project rooms and receive live updates for task and project events.

## Email Verification

Email delivery uses the SendGrid Web API. Verify the sender identity in SendGrid and set `SMTP_FROM` to that verified email.
