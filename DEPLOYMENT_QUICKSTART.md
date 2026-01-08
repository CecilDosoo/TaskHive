# Quick Deployment Guide - Railway

This is a simplified step-by-step guide to deploy TaskHive on Railway.

## Step 1: Prepare Your Code

1. Make sure your code is committed and pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Create a production-ready `.env.example` file in `backend/`:
```bash
# Copy this to Railway as environment variables
DATABASE_URL=# Railway will provide this automatically
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.railway.app
JWT_SECRET=generate-a-random-string-here
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_FROM="TaskHive <your-email@gmail.com>"
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
SESSION_SECRET=generate-another-random-string
```

## Step 2: Deploy on Railway

### A. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### B. Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your TaskHive repository

### C. Add PostgreSQL Database
1. In your project, click "New" → "Database" → "PostgreSQL"
2. Railway will create a PostgreSQL database
3. Click on the database service
4. Go to "Variables" tab
5. Copy the `DATABASE_URL` value (you'll need this)

### D. Configure Backend Service
1. Railway should have auto-detected your backend
2. If not, click "New" → "GitHub Repo" → Select your repo
3. Click on the backend service
4. Go to "Settings" → Set:
   - **Root Directory**: `backend`
5. Go to "Variables" tab → Add:
   ```
   DATABASE_URL = (paste from PostgreSQL service)
   PORT = 5000
   NODE_ENV = production
   FRONTEND_URL = (we'll set this after frontend deploys)
   JWT_SECRET = (generate: openssl rand -hex 32)
   SMTP_USER = your-email@gmail.com
   SMTP_PASS = your-gmail-app-password
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_SECURE = false
   SMTP_FROM = TaskHive <your-email@gmail.com>
   SESSION_SECRET = (generate: openssl rand -hex 32)
   ```
6. Railway will auto-build and deploy
7. After deployment, copy your backend URL (looks like `https://xxx.up.railway.app`)

### E. Run Database Migrations
1. Click on backend service → "Deployments" tab
2. Click the three dots on latest deployment → "Open Terminal"
3. Run:
```bash
cd backend
npx prisma migrate deploy
```
4. Wait for it to complete

### F. Deploy Frontend Service
1. In the same Railway project, click "New" → "GitHub Repo"
2. Select the same repository
3. Click on the new service → "Settings":
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: (leave empty or use `npx vite preview`)
4. Go to "Variables" tab → Add:
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   ```
   (Replace with your actual backend URL)
5. Go to "Settings" → "Networking" → Generate a domain

### G. Update Backend FRONTEND_URL
1. Go back to backend service → "Variables"
2. Update `FRONTEND_URL` to your frontend Railway URL
3. Redeploy backend (Railway will auto-redeploy)

## Step 3: Update Google OAuth (if using)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Update OAuth redirect URIs:
   - Add: `https://your-backend-url.railway.app/api/auth/google/callback`
3. Update authorized JavaScript origins:
   - Add: `https://your-backend-url.railway.app`

## Step 4: Test Your Deployment

1. Open your frontend URL
2. Try registering a new account
3. Check your email for verification link
4. Log in and test creating projects/tasks
5. Test in multiple browsers to verify real-time updates

## Done! 🎉

Your app should now be live. Both services will auto-deploy when you push to GitHub.

## Tips

- **Custom Domain**: Add your own domain in Railway settings
- **Monitoring**: Check logs in Railway dashboard
- **Environment Variables**: Update variables without redeploying (auto-redeploys)
- **Database Backups**: Railway automatically backs up your database

