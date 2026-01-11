# Fix FRONTEND_URL Still Showing localhost

## 🐛 Problem

Railway logs still show: `FRONTEND_URL: http://localhost:5173`
And redeploy failed.

## 🔍 Let's Fix This Step by Step

### Step 1: Verify Variable is Actually Set

**Check via Railway CLI:**
```bash
railway variables
```

**Should show:**
```
FRONTEND_URL: https://task-hive-psi.vercel.app
```

**If it still shows localhost:**
- The variable update didn't work
- Need to set it again

### Step 2: Set FRONTEND_URL Again (Force Update)

**Via CLI:**
```bash
railway variables --set "FRONTEND_URL=https://task-hive-psi.vercel.app"
```

**Or via Railway Web:**
1. Railway Dashboard → Backend Service
2. **Settings** → **Variables**
3. Find `FRONTEND_URL`
4. **Edit** or **Delete and Re-add**
5. Set value to: `https://task-hive-psi.vercel.app`
6. **Save**

### Step 3: Check Why Redeploy Failed

**Check Railway deployment logs:**
- Railway Dashboard → Backend Service
- **Deployments** tab
- Click on the failed deployment
- Check **Deploy Logs** or **Build Logs**
- What error does it show?

### Step 4: Force Redeploy

**Option A: Via Railway Web**
1. Railway → Backend Service → Deployments
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

**Option B: Trigger via Code Change**
- Make a small change (add a comment) to any backend file
- Commit and push
- Railway will auto-deploy

**Option C: Via Railway CLI**
```bash
railway up
```

### Step 5: Verify After Redeploy

**Check logs:**
```bash
railway logs
```

**Look for:**
```
FRONTEND_URL: https://task-hive-psi.vercel.app
```

**Should NOT show:**
```
FRONTEND_URL: http://localhost:5173
```

---

## 🐛 If Redeploy Keeps Failing

### Common Issues:

1. **Build Error:**
   - Check build logs for TypeScript/compilation errors
   - Check if all dependencies are installed

2. **Database Connection Error:**
   - Check DATABASE_URL is set
   - Verify PostgreSQL service is running

3. **Port/Startup Error:**
   - Check if PORT variable is set
   - Verify start command in package.json

4. **Out of Memory/Resources:**
   - Check Railway plan limits
   - Check resource usage

---

## 📋 Quick Checklist

- [ ] Verify FRONTEND_URL is set in Railway variables
- [ ] Value is: `https://task-hive-psi.vercel.app` (not localhost)
- [ ] Try setting it again if it's wrong
- [ ] Check why redeploy failed (check deployment logs)
- [ ] Fix any deployment errors
- [ ] Redeploy again
- [ ] Verify logs show correct FRONTEND_URL
- [ ] Test frontend login again

---

**Let me check what the actual variable value is and why the redeploy failed!** 🔍

