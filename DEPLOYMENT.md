# TaskHive Deployment Guide

This guide covers deploying TaskHive to production. We'll use **Railway** (recommended) or **Render** as they handle both frontend, backend, and PostgreSQL databases easily.

## Table of Contents
- [Option 1: Railway (Recommended)](#option-1-railway-recommended)
- [Option 2: Render](#option-2-render)
- [Option 3: Vercel + Railway/Render](#option-3-vercel--railwayrender)
- [Environment Variables](#environment-variables)
- [Post-Deployment Checklist](#post-deployment-checklist)

---

## Option 1: Railway (Recommended)

Railway is the easiest option for full-stack apps with databases.

### Prerequisites
- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))

### Steps

#### 1. Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### 2. Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Click "New" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect it's a Node.js project

**Add PostgreSQL Database:**
1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway will create a PostgreSQL database

**Configure Backend:**
1. Click on your backend service
2. Go to "Variables" tab
3. Add these environment variables (see [Environment Variables](#environment-variables) section)
4. **Important**: Set `DATABASE_URL` from the PostgreSQL service:
   - Click on the PostgreSQL service
   - Go to "Variables" tab
   - Copy the `DATABASE_URL` value
   - Paste it in your backend service variables
5. Set `NODE_ENV=production`
6. Set `PORT` (Railway auto-assigns, but you can override)

**Build & Deploy Settings:**
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run prisma:generate && npm run build`
- **Start Command**: `npm run start`
- **Watch Paths**: `backend/**`

**Run Migrations:**
1. Go to your backend service
2. Click "Deployments" tab
3. Click the three dots on the latest deployment → "Open Terminal"
4. Run: `npx prisma migrate deploy`
5. This applies all migrations to your production database

#### 3. Deploy Frontend on Railway

1. In the same Railway project, click "New" → "GitHub Repo"
2. Select the same repository
3. Railway will create a new service

**Configure Frontend:**
1. Click on the frontend service
2. Go to "Variables" tab
3. Add:
   - `VITE_API_URL` = Your backend URL (from Railway, e.g., `https://your-backend.up.railway.app/api`)
4. Set **Root Directory**: `frontend`
5. Set **Build Command**: `npm install && npm run build`
6. Set **Start Command**: (leave empty, Railway uses `npx vite preview`)
7. Set **Output Directory**: `dist`

**Custom Domain (Optional):**
1. Click on your frontend service
2. Go to "Settings" → "Networking"
3. Generate a domain or add your custom domain

---

## Option 2: Render

### Prerequisites
- GitHub account
- Render account (sign up at [render.com](https://render.com))

### Steps

#### 1. Deploy Backend on Render

1. Go to [render.com](https://render.com) → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `taskhive-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm run start`
4. Add environment variables (see [Environment Variables](#environment-variables) section)
5. Create PostgreSQL database:
   - Go to "New" → "PostgreSQL"
   - Copy the "Internal Database URL"
   - Set it as `DATABASE_URL` in your web service
6. After first deployment, go to "Shell" and run:
   ```bash
   npx prisma migrate deploy
   ```

#### 2. Deploy Frontend on Render

1. Go to "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `taskhive-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` = Your backend URL (e.g., `https://taskhive-backend.onrender.com/api`)

---

## Option 3: Vercel (Frontend) + Railway/Render (Backend)

This splits deployment but gives you Vercel's excellent frontend CDN.

### Deploy Backend
Follow **Option 1** (Railway) or **Option 2** (Render) backend steps above.

### Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` = Your backend URL
5. Deploy!

---

## Environment Variables

### Backend Variables (Required)

Create a `.env` file or add these in your hosting platform:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL="https://your-frontend-domain.com"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Email (SMTP)
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_FROM="TaskHive <your-email@gmail.com>"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Session Secret (for OAuth)
SESSION_SECRET="your-random-session-secret"
```

### Frontend Variables

```env
# API URL
VITE_API_URL="https://your-backend-domain.com/api"
```

**Note**: Railway/Render automatically provide `DATABASE_URL` for PostgreSQL services. Just copy it from your database service to your backend service.

---

## Post-Deployment Checklist

### Backend
- [ ] Environment variables set correctly
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Backend URL is accessible (test with `/api/health` or similar)
- [ ] CORS is configured for your frontend URL
- [ ] Email SMTP credentials are set (if using email verification)
- [ ] Google OAuth credentials are set (if using Google login)
- [ ] Socket.IO is working (test real-time updates)

### Frontend
- [ ] `VITE_API_URL` points to your backend
- [ ] Build completes without errors
- [ ] Frontend loads correctly
- [ ] Can login/register
- [ ] Can create projects and tasks
- [ ] Real-time updates work (Socket.IO)

### Database
- [ ] PostgreSQL database is accessible
- [ ] Migrations are applied
- [ ] Can query data successfully

### Testing
- [ ] Create a new account
- [ ] Verify email (if enabled)
- [ ] Create a project
- [ ] Create a task
- [ ] Assign task to a member
- [ ] Test real-time updates (open in two browsers)
- [ ] Test notifications
- [ ] Test file uploads (if using attachments)

---

## Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify `DATABASE_URL` is correct
- Check build logs for errors
- Ensure `JWT_SECRET` is set

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend URL doesn't have trailing slash (`/api` not `/api/`)

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check if database service is running
- Ensure migrations have been run

### Email not sending
- Verify SMTP credentials
- Check if using App Password (Gmail) instead of regular password
- Check email service logs

### Google OAuth not working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Update OAuth redirect URIs in Google Console to match production URLs
- Check that callback URL is correct: `https://your-backend.com/api/auth/google/callback`

---

## Production Best Practices

1. **Security:**
   - Use strong, unique `JWT_SECRET` (generate with `openssl rand -hex 32`)
   - Use strong, unique `SESSION_SECRET`
   - Never commit `.env` files
   - Use environment variables for all secrets

2. **Performance:**
   - Enable production builds (`NODE_ENV=production`)
   - Use CDN for frontend (Vercel or Railway's CDN)
   - Enable database connection pooling
   - Consider adding rate limiting

3. **Monitoring:**
   - Set up error tracking (Sentry, LogRocket, etc.)
   - Monitor database performance
   - Set up uptime monitoring
   - Monitor API response times

4. **Backups:**
   - Enable automated database backups (Railway/Render do this automatically)
   - Regularly test backup restoration
   - Keep backups for at least 30 days

---

## Quick Start Commands

### Local Testing Before Deployment
```bash
# Backend
cd backend
npm install
npm run prisma:generate
npm run build
npm run start

# Frontend
cd frontend
npm install
npm run build
npm run preview
```

### Railway Quick Deploy
1. Push code to GitHub
2. Connect repo to Railway
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

---

## Need Help?

If you run into issues:
1. Check the deployment logs in your hosting platform
2. Verify all environment variables are set
3. Test locally first to isolate issues
4. Check the Troubleshooting section above

Happy deploying! 🚀

