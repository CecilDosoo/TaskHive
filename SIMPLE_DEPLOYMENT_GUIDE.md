# Simple Deployment Guide - Step by Step

This guide will walk you through completing your TaskHive deployment. Follow each step in order.

---

## ✅ Step 1: Your Backend is Already Deployed!

Great news - your backend code is already on Railway and built successfully! Now we just need to configure it.

---

## 📝 Step 2: Add Environment Variables

Environment variables are settings your app needs to run (like database passwords, API keys, etc.).

### How to Add Variables:

1. **Go to Railway Dashboard**
   - Open [railway.app](https://railway.app) in your browser
   - Sign in if needed
   - Click on your **TaskHive** project

2. **Find Your Backend Service**
   - You should see a service card (probably named "TaskHive" or your repo name)
   - Click on it

3. **Open Variables Tab**
   - Click the **"Variables"** tab at the top
   - You'll see a list of variables (might be empty)

4. **Add Each Variable One by One**
   - Click **"+ New Variable"** or **"Add Variable"**
   - Type the **Name** (left side)
   - Type the **Value** (right side)
   - Click **"Add"** or **"Save"**

### Variables to Add:

#### 1. DATABASE_URL (Most Important!)
   - **Name:** `DATABASE_URL`
   - **How to get it:**
     
     **First, you need to add a PostgreSQL database:**
     1. In Railway, in your project, click the **"New"** button (top right)
     2. Click **"Database"** from the dropdown menu
     3. Click **"Add PostgreSQL"**
     4. Railway will create a PostgreSQL database service (this takes a minute)
     5. You'll see a new card appear for PostgreSQL
     
     **Now get the DATABASE_URL:**
     1. Click on the **PostgreSQL** service card (the new one that appeared)
     2. Go to **"Variables"** tab
     3. Find `DATABASE_URL` in the list
     4. **Copy the entire value** (it's long, make sure you get all of it)
     5. Go back to your backend service (click on the TaskHive/backend card)
     6. Go to **"Variables"** tab
     7. Click **"+ New Variable"**
     8. **Name:** `DATABASE_URL`
     9. **Value:** Paste the DATABASE_URL you copied
     10. Click **"Add"** or **"Save"**

#### 2. JWT_SECRET
   - **Name:** `JWT_SECRET`
   - **Value:** Generate a random string (any long random text)
   - **Example:** `my-super-secret-jwt-key-12345-abcdef`
   - **Tip:** Use a password generator or just type random characters

#### 3. JWT_EXPIRES_IN
   - **Name:** `JWT_EXPIRES_IN`
   - **Value:** `7d`
   - (This means tokens expire in 7 days)

#### 4. NODE_ENV
   - **Name:** `NODE_ENV`
   - **Value:** `production`

#### 5. FRONTEND_URL
   - **Name:** `FRONTEND_URL`
   - **Value:** For now, use `http://localhost:5173` (we'll update this later)
   - (This is where your frontend will be)

#### 6. PORT (Don't Add This!)
   - **You DON'T need to add this variable**
   - Railway automatically sets `PORT` for you
   - Your backend code will automatically use it
   - Just skip this one - you're all good!

### Optional: Email Variables (Only if you want email verification)

If you set up email earlier, add these:

- **Name:** `SMTP_USER` → **Value:** Your Gmail address
- **Name:** `SMTP_PASS` → **Value:** Your Gmail App Password
- **Name:** `SMTP_FROM` → **Value:** `TaskHive <your-email@gmail.com>`
- **Name:** `SMTP_HOST` → **Value:** `smtp.gmail.com`
- **Name:** `SMTP_PORT` → **Value:** `587`
- **Name:** `SMTP_SECURE` → **Value:** `false`

### Optional: Google OAuth (Only if you want Google sign-in)

- **Name:** `GOOGLE_CLIENT_ID` → **Value:** Your Google Client ID
- **Name:** `GOOGLE_CLIENT_SECRET` → **Value:** Your Google Client Secret
- **Name:** `GOOGLE_CALLBACK_URL` → **Value:** We'll set this after getting your backend URL

---

## 🗄️ Step 3: Run Database Migrations (AUTOMATIC!)

Good news! I've set up your code to automatically run migrations when the server starts. You don't need to find a terminal!

### What Happens:

When Railway starts your backend, it will:
1. Automatically run database migrations
2. Then start your server

### You Just Need to:

1. **Make sure you've added `DATABASE_URL`** to your environment variables (from Step 2)
2. **Redeploy your backend** (or wait for the next automatic deployment)

### How to Redeploy (if needed):

1. **In Railway, go to your backend service**
2. **Click "Deployments" tab**
3. **Click "Redeploy"** button (top right) or click the three dots (⋯) on the latest deployment → **"Redeploy"**
4. **Wait for it to deploy** (takes 1-2 minutes)
5. **Check the logs** - you should see "All migrations have been applied" in the deploy logs

### Check if Migrations Ran:

1. **Go to "Deploy Logs"** tab in your deployment
2. **Look for:** "All migrations have been applied" or "Migration applied"
3. **If you see errors about database**, make sure `DATABASE_URL` is set correctly

**That's it! No terminal needed!** 🎉

---

## 🔗 Step 4: Get Your Backend URL

You need to know your backend URL to connect your frontend to it.

### How to Get It:

1. **In Railway, go to your backend service**
2. **Click "Settings" tab** (at the top)
3. **Scroll down to "Networking" section**
4. **Click "Generate Domain"** button
5. **Railway will create a URL** like: `your-backend-1234.up.railway.app`
6. **Copy this URL** - you'll need it!

**Your API will be at:** `https://your-backend-url.up.railway.app/api`

**Example:** If your URL is `taskhive-backend.up.railway.app`, your API is at:
`https://taskhive-backend.up.railway.app/api`

---

## ✅ Step 5: Test Your Backend

Let's make sure it's working!

### Quick Test:

1. **Open a new browser tab**
2. **Go to:** `https://your-backend-url.up.railway.app/api`
3. **You should see something** (might be an error, but that's okay - it means it's running!)

Or test a specific endpoint:
- Go to: `https://your-backend-url.up.railway.app/api/auth/register`
- You might see an error about missing data, but that means the server is running!

---

## 🎨 Step 6: Deploy Your Frontend

Now let's get your frontend online. You have two options:

### Option A: Deploy on Railway (Easier - Same Place)

1. **In Railway, go to your project**
2. **Click "New" button** (top right)
3. **Click "GitHub Repo"**
4. **Select your repository** (same one you used for backend)
5. **Railway will create a new service**

6. **Configure it:**
   - Click on the new service
   - Go to **"Settings"** tab
   - Find **"Root Directory"** → Set to: `frontend`
   - Find **"Build Command"** → Set to: `npm install && npm run build`
   - Find **"Start Command"** → Leave empty (Railway will auto-detect)
   - Find **"Output Directory"** → Set to: `dist`

7. **Add Environment Variable:**
   - Go to **"Variables"** tab
   - Click **"+ New Variable"**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.up.railway.app/api`
   - (Use the backend URL you got in Step 4)

8. **Railway will automatically deploy!**
   - Wait a few minutes
   - Check the **"Deployments"** tab to see progress

9. **Get Your Frontend URL:**
   - Go to **"Settings"** → **"Networking"**
   - Click **"Generate Domain"**
   - Copy this URL!

### Option B: Deploy on Vercel (Recommended - Better for Frontend)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** (use GitHub to sign in)
3. **Click "Add New Project"** or **"New Project"**
4. **Select your repository** from the list
5. **Configure Project:**
   - **Root Directory:** Click "Edit" → Type: `frontend`
   - **Framework Preset:** Should auto-detect "Vite" (if not, select it)
   - **Build Command:** `npm run build` (should be auto-filled)
   - **Output Directory:** `dist` (should be auto-filled)

6. **Add Environment Variable:**
   - Scroll down to **"Environment Variables"**
   - Click **"Add"** or **"+ New"**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.up.railway.app/api`
   - (Use the backend URL you got in Step 4)

7. **Click "Deploy"**
   - Wait 2-3 minutes
   - Vercel will build and deploy your frontend

8. **Get Your Frontend URL:**
   - After deployment, you'll see a URL like: `your-project.vercel.app`
   - Copy this URL!

---

## 🔄 Step 7: Update Frontend URL in Backend

Now that you have your frontend URL, update the backend:

1. **Go back to Railway** → Your backend service
2. **Go to "Variables" tab**
3. **Find `FRONTEND_URL`** (you added this in Step 2)
4. **Click to edit it**
5. **Change the value to your frontend URL:**
   - If on Railway: `https://your-frontend-url.up.railway.app`
   - If on Vercel: `https://your-project.vercel.app`
6. **Save**

Railway will automatically redeploy with the new value.

---

## 🔐 Step 8: Update Google OAuth (If Using)

If you set up Google OAuth earlier:

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Sign in**
3. **Go to:** APIs & Services → Credentials
4. **Click on your OAuth 2.0 Client ID**
5. **Find "Authorized redirect URIs"**
6. **Click "Add URI"**
7. **Add:** `https://your-backend-url.up.railway.app/api/auth/google/callback`
   - (Use your actual backend URL from Step 4)
8. **Find "Authorized JavaScript origins"**
9. **Click "Add URI"**
10. **Add your frontend URL:**
    - `https://your-frontend-url.up.railway.app` (if on Railway)
    - OR `https://your-project.vercel.app` (if on Vercel)
11. **Click "Save"**

12. **Update Railway Variable:**
    - Go back to Railway → Backend service → Variables
    - Find `GOOGLE_CALLBACK_URL`
    - Update it to: `https://your-backend-url.up.railway.app/api/auth/google/callback`
    - Save

---

## 🎉 Step 9: Test Everything!

Now test your full application:

1. **Open your frontend URL** in a browser
2. **Try to register** a new account
3. **Check your email** (if email is set up) for verification
4. **Try logging in**
5. **Create a project**
6. **Create tasks**
7. **Test all features!**

---

## ❓ Troubleshooting

### "Backend not working"
- Check Railway → Deployments → View Logs
- Make sure all variables are set correctly
- Verify `DATABASE_URL` is correct

### "Can't connect to database"
- Make sure you ran migrations (Step 3)
- Check `DATABASE_URL` is from the PostgreSQL service
- Verify PostgreSQL service is running (not paused)

### "Frontend can't connect to backend"
- Check `VITE_API_URL` is set correctly in frontend
- Make sure it includes `/api` at the end
- Verify backend URL is correct

### "CORS errors"
- Make sure `FRONTEND_URL` in backend matches your actual frontend URL
- Check it includes `https://` and no trailing slash

---

## 📋 Quick Checklist

- [ ] Added all environment variables to backend
- [ ] Ran database migrations
- [ ] Got backend URL
- [ ] Deployed frontend (Railway or Vercel)
- [ ] Set `VITE_API_URL` in frontend
- [ ] Updated `FRONTEND_URL` in backend
- [ ] Updated Google OAuth redirect URIs (if using)
- [ ] Tested the full application

---

## 🎯 You're Done!

Your TaskHive application should now be fully deployed and working!

**Your URLs:**
- **Backend API:** `https://your-backend.up.railway.app/api`
- **Frontend:** `https://your-frontend.vercel.app` (or Railway URL)

**Need Help?**
- Check Railway logs: Deployments → View Logs
- Check Vercel logs: Deployments → View Logs
- Make sure all environment variables are set
- Verify database migrations ran successfully

---

## 💡 Pro Tips

1. **Save your URLs** somewhere safe - you'll need them!
2. **Keep your environment variables secure** - don't share them
3. **Check logs regularly** if something isn't working
4. **Railway gives you free credits** - monitor usage in Settings
5. **Vercel is free** for personal projects

Good luck! 🚀

