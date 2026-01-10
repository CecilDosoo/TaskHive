# Deploy Frontend to Vercel - Step by Step

## ✅ Prerequisites

- ✅ Frontend code is on GitHub (already done!)
- ✅ `.env.production` is configured with production backend URL
- ✅ `vercel.json` exists in `frontend/` folder

---

## 🚀 Method 1: Deploy via Vercel Dashboard (Recommended - Easiest)

### Step 1: Sign Up/Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or **"Login"** if you have an account)
3. Choose **"Continue with GitHub"** (recommended - easiest)
4. Authorize Vercel to access your GitHub

### Step 2: Create New Project

1. In Vercel dashboard, click **"+ Add New..." → "Project"**
2. You'll see a list of your GitHub repositories
3. **Find and select** `taskhive2` (or your repo name)
4. Click **"Import"**

### Step 3: Configure Project Settings

**After clicking "Import", you'll see the "Configure Project" page. Here's what to do:**

#### Setting Root Directory (IMPORTANT!):

1. **Look for the "Root Directory" section** - it's usually near the top, below the project name
2. You'll see it says something like:
   ```
   Root Directory: . (current: ./)
   ```
3. **Click on "Edit"** (or the pencil icon) next to "Root Directory"
4. A text input or dropdown will appear
5. **Type or select:** `frontend`
   - Make sure it says `frontend` (not `./frontend` or `/frontend`, just `frontend`)
6. **Click "Continue"** or press Enter
7. The Root Directory should now show: `frontend` (current: ./frontend)

**Why this matters:** Since your repo has both `backend/` and `frontend/` folders, Vercel needs to know which one to build and deploy!

#### Other Settings (Should Auto-Fill):

1. **Framework Preset:**
   - Should auto-detect **"Vite"** after setting root directory
   - If not, look for a dropdown and select **"Vite"** manually

2. **Build Command:**
   - Should automatically show: `npm run build`
   - If it's different, change it to: `npm run build`

3. **Output Directory:**
   - Should automatically show: `dist`
   - If it's different, change it to: `dist`

4. **Install Command:**
   - Should automatically show: `npm install`
   - If it's different, change it to: `npm install`

**Alternative Method if you don't see "Edit":**
- Sometimes Vercel shows a dropdown or input field directly
- Look for a field labeled "Root Directory" or "Project Root"
- Type `frontend` in that field
- Or if there's a folder icon, click it and select the `frontend` folder

### Step 4: Add Environment Variables

**Click "Environment Variables" section:**

Add this variable:

- **Name:** `VITE_API_URL`
- **Value:** `https://taskhive-production-4dce.up.railway.app/api`
- **Environment:** Select all (Production, Preview, Development)

**Or use the `.env.production` file you already have** - Vercel should detect it automatically!

### Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait for deployment (usually 1-2 minutes)
3. Watch the build logs in real-time
4. Once complete, you'll see: **"Congratulations! Your deployment is ready!"**

### Step 6: Get Your Frontend URL

After deployment, Vercel will give you a URL like:
```
https://taskhive2-abc123.vercel.app
```

**Copy this URL!** You'll need it in the next step.

---

## 🔧 Method 2: Deploy via Vercel CLI (Advanced)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Navigate to Frontend

```bash
cd frontend
```

### Step 4: Deploy

```bash
vercel
```

**Follow the prompts:**
- Link to existing project? (Yes, if you already created one, or No to create new)
- Which scope? (Your account)
- Project name? (`taskhive-frontend` or similar)
- Directory? (Press Enter - current directory)
- Override settings? (No, unless you need to change something)

### Step 5: Set Environment Variables

```bash
vercel env add VITE_API_URL
```

**When prompted:**
- Value: `https://taskhive-production-4dce.up.railway.app/api`
- Environment: Select all (Production, Preview, Development)

### Step 6: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## ⚙️ After Deployment - Update Backend CORS

### Step 1: Get Your Vercel Frontend URL

Your frontend will be at: `https://your-project-name.vercel.app`

### Step 2: Update Railway Backend

**Update `FRONTEND_URL` in Railway:**

```bash
railway variables --set "FRONTEND_URL=https://your-project-name.vercel.app"
```

**Or via Railway web:**
- Railway → Backend service → Variables
- Edit `FRONTEND_URL`
- Set to your Vercel URL

### Step 3: Verify CORS Settings

**Your backend CORS is already configured in `backend/src/server.ts`:**

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

**This should work automatically once you set `FRONTEND_URL`!**

---

## ✅ Test Your Deployment

### 1. Open Your Vercel URL

```
https://your-project-name.vercel.app
```

### 2. Check if Frontend Loads

- Should see your login/register page
- No errors in browser console

### 3. Test Login/Register

- Try creating an account
- Try logging in
- Check Network tab - requests should go to Railway backend

### 4. Test Full Functionality

- Create a project
- Add tasks
- Everything should work!

---

## 🔄 Continuous Deployment

**Vercel automatically deploys when you push to GitHub!**

1. Make changes to your frontend code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push
   ```
3. Vercel automatically detects the push
4. Builds and deploys automatically
5. You get a new deployment URL for each push (preview deployments)

---

## 📝 Important Notes

### Environment Variables

- **Production:** Uses `.env.production` or Vercel environment variables
- **Preview:** Uses Vercel environment variables (for PR previews)
- **Development:** Uses `.env.local` (only local)

**Make sure `VITE_API_URL` is set in Vercel for all environments!**

### React Router Configuration

Your `vercel.json` already has the rewrites configured for React Router to work correctly:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes work correctly (no 404 errors on refresh).

### Custom Domain (Optional)

1. Vercel → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` in Railway to match

---

## 🐛 Troubleshooting

### Build Fails

**Check:**
- Is `frontend/package.json` correct?
- Are all dependencies listed?
- Check build logs in Vercel dashboard

### Environment Variables Not Working

**Check:**
- Did you add `VITE_API_URL` in Vercel?
- Is the value correct?
- Did you select all environments (Production, Preview, Development)?
- Redeploy after adding variables

### CORS Errors

**Check:**
- Is `FRONTEND_URL` set in Railway?
- Does it match your Vercel URL exactly?
- Did you redeploy Railway backend after changing `FRONTEND_URL`?

### 404 Errors on Routes

**Check:**
- Does `vercel.json` have the rewrites?
- Is the build output `dist`?

### Frontend Can't Connect to Backend

**Check:**
- Is backend running? (`railway logs`)
- Is `VITE_API_URL` correct in Vercel?
- Check browser Network tab - what URL is it trying to connect to?

---

## 🎯 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] Environment variable `VITE_API_URL` added
- [ ] Deployed successfully
- [ ] Frontend URL obtained
- [ ] `FRONTEND_URL` updated in Railway
- [ ] Tested login/register
- [ ] Tested creating projects/tasks

---

## 📊 What You'll Have After Deployment

**Backend:** `https://taskhive-production-4dce.up.railway.app`  
**Frontend:** `https://your-project-name.vercel.app`  
**Database:** PostgreSQL on Railway (production)

**Full stack deployed!** 🎉

---

**Ready to deploy? Let's go!** 🚀

