# Force Railway Redeploy - Multiple Methods

## 🐛 Problem

- Variable is set correctly: `FRONTEND_URL: https://task-hive-psi.vercel.app`
- But logs still show: `FRONTEND_URL: http://localhost:5173`
- Redeploy failed

## 🔍 Let's Try Different Approaches

### Method 1: Via Railway Web Dashboard (Most Reliable)

1. **Go to Railway Dashboard:**
   - Open your project
   - Click on **Backend service** (TaskHive)

2. **Check Variables:**
   - Settings → Variables
   - Find `FRONTEND_URL`
   - **Delete it completely**
   - **Add it again** with value: `https://task-hive-psi.vercel.app`
   - Save

3. **Trigger Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** (three dots) on latest deployment
   - Click **"Redeploy"**
   - OR click **"Deploy"** button if available

### Method 2: Push a Code Change (Forces New Deploy)

**I just made a small change to `backend/src/server.ts`:**

1. **Commit and push:**
   ```bash
   git add backend/src/server.ts
   git commit -m "Trigger Railway redeploy for FRONTEND_URL"
   git push origin main
   ```

2. **Railway will auto-deploy** from the new commit

### Method 3: Check for Multiple Variable Levels

**Railway might have variables at different levels:**

1. **Project-level variables** (applies to all services)
2. **Service-level variables** (applies to one service)

**Check both:**
- Railway → **Project** → Settings → Variables (Project-level)
- Railway → **Backend Service** → Settings → Variables (Service-level)

**Make sure `FRONTEND_URL` is set at the SERVICE level, not project level!**

### Method 4: Use Railway CLI to Force Deploy

```bash
# Make sure you're in the backend directory context
railway link
railway up
```

### Method 5: Check Why Redeploy Failed

**In Railway Dashboard:**
- Backend Service → Deployments
- Click on the **failed deployment**
- Check **Build Logs** or **Deploy Logs**
- What error message does it show?

**Common errors:**
- Build timeout
- Database connection error
- Out of memory
- Build script error

---

## ✅ After Successful Redeploy

**Check logs again:**
```bash
railway logs
```

**Should show:**
```
FRONTEND_URL: https://task-hive-psi.vercel.app
```

**NOT:**
```
FRONTEND_URL: http://localhost:5173
```

---

## 🚀 Quickest Fix

**Try Method 2 first** (push code change):
1. I've already made a small change
2. Commit and push it
3. Railway will auto-deploy
4. Check if FRONTEND_URL is correct in new logs

**If that doesn't work, try Method 1** (delete and re-add variable via web)

