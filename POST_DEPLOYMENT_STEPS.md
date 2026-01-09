# Post-Deployment Steps

## ✅ Backend Deployed Successfully!

Your backend is now live on Railway. Here's what to do next:

---

## 1. Set Up Environment Variables

Go to your Railway backend service → **Variables** tab and add:

### Required Variables:
```
DATABASE_URL=<from PostgreSQL service>
JWT_SECRET=<generate a random string>
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=<auto-assigned by Railway>
FRONTEND_URL=<your frontend URL>
```

### Email Configuration (if using):
```
SMTP_USER=<your-email@gmail.com>
SMTP_PASS=<your-app-password>
SMTP_FROM=TaskHive <your-email@gmail.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Google OAuth (if using):
```
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
GOOGLE_CALLBACK_URL=https://your-backend.up.railway.app/api/auth/google/callback
```

**To get DATABASE_URL:**
1. Click on your PostgreSQL service in Railway
2. Go to **Variables** tab
3. Copy the `DATABASE_URL` value
4. Paste it in your backend service variables

---

## 2. Run Database Migrations

1. Go to your backend service → **Deployments** tab
2. Click on the latest deployment
3. Click the **three dots (⋯)** → **Open Terminal**
4. Run:
   ```bash
   npx prisma migrate deploy
   ```

This will apply all your database migrations to production.

---

## 3. Get Your Backend URL

1. Go to your backend service → **Settings** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** (or use your custom domain)
4. Copy the URL (e.g., `https://your-backend.up.railway.app`)

**Your API will be at:** `https://your-backend.up.railway.app/api`

---

## 4. Test Your Backend

Test that your API is working:

```bash
# Health check (if you have one)
curl https://your-backend.up.railway.app/api/health

# Or test a public endpoint
curl https://your-backend.up.railway.app/api/auth/register
```

---

## 5. Deploy Frontend

### Option A: Deploy on Railway (Same Project)

1. In your Railway project, click **"New"** → **"GitHub Repo"**
2. Select the same repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: (leave empty, Railway uses `npx vite preview`)
   - **Output Directory**: `dist`

4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```

5. Railway will auto-deploy!

### Option B: Deploy on Vercel (Recommended for Frontend)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Select your repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```

7. Click **"Deploy"**

---

## 6. Update OAuth Redirect URIs

If you're using Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-backend.up.railway.app/api/auth/google/callback
   ```
5. Add to **Authorized JavaScript origins**:
   ```
   https://your-frontend-domain.com
   ```
6. Save

---

## 7. Update Frontend API URL

Once your frontend is deployed:

1. Update `VITE_API_URL` in your frontend deployment to point to your Railway backend
2. Redeploy the frontend

---

## 8. Test the Full Application

1. Visit your frontend URL
2. Try registering a new account
3. Check that emails are sent (if configured)
4. Test logging in
5. Create a project
6. Create tasks
7. Test all features!

---

## Troubleshooting

### Backend not starting?
- Check **Deployments** → **View Logs** for errors
- Verify all environment variables are set
- Make sure `DATABASE_URL` is correct

### Database connection errors?
- Verify `DATABASE_URL` is from the PostgreSQL service
- Check that migrations ran successfully
- Ensure PostgreSQL service is running

### API not accessible?
- Check Railway service is running (not paused)
- Verify the domain is generated
- Check CORS settings if frontend can't connect

### Frontend can't connect to backend?
- Verify `VITE_API_URL` is set correctly
- Check CORS is configured in backend
- Make sure backend URL includes `/api` if needed

---

## 🎉 You're Live!

Your TaskHive application should now be fully deployed and accessible!

**Next Steps:**
- Share your app with users
- Monitor logs in Railway
- Set up custom domains (optional)
- Configure backups for your database
- Set up monitoring/alerts (optional)

---

## Quick Reference

**Backend URL:** `https://your-backend.up.railway.app`  
**API Base:** `https://your-backend.up.railway.app/api`  
**Frontend URL:** `https://your-frontend.vercel.app` (or Railway URL)

**Railway Dashboard:** [railway.app](https://railway.app)  
**Vercel Dashboard:** [vercel.com](https://vercel.com)

