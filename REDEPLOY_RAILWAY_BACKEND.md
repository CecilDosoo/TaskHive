# Redeploy Railway Backend - Quick Guide

## ✅ FRONTEND_URL is Now Set Correctly!

I just updated it to: `https://task-hive-psi.vercel.app`

## 🔄 Now Redeploy Railway Backend

**Environment variables only apply when the server starts, so you need to redeploy!**

### Option 1: Via Railway Web (Easiest)

1. **Go to Railway Dashboard:**
   - Open your project
   - Click on your **backend service** (TaskHive)

2. **Redeploy:**
   - Click **"Deployments"** tab (or find the latest deployment)
   - Click the **"..."** (three dots) menu
   - Click **"Redeploy"**
   - Wait for deployment to complete (usually 1-2 minutes)

### Option 2: Via Railway CLI

```bash
railway up
```

Or trigger a redeploy by making a small change to trigger a new deployment.

---

## ✅ After Redeploy

**Check logs to verify FRONTEND_URL is updated:**

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

## 🧪 Test Again

**After redeploy:**

1. Wait for deployment to complete
2. Open your Vercel frontend: `https://task-hive-psi.vercel.app`
3. Try to log in again
4. Should work now! ✅

---

**The issue was that FRONTEND_URL was still set to localhost, so CORS was blocking your Vercel requests. Now it's fixed, just need to redeploy!** 🚀

