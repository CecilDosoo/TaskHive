# Complete Fix for Network Error

## 🎯 Two Things to Fix

### 1. Set Frontend Environment Variable (Vercel)

**The frontend needs to know where your backend is:**

1. **Vercel Dashboard:**
   - Project: "task-hive"
   - **Settings** → **Environment Variables**
   - Click **"Add New"**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://taskhive-production-4dce.up.railway.app/api`
   - **Environment:** Select ALL (Production, Preview, Development)
   - Click **"Save"**

2. **CRITICAL: Redeploy!**
   - Go to **"Deployments"** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**
   - **Environment variables only apply to NEW deployments!**

### 2. Set Backend CORS (Railway)

**The backend needs to allow your Vercel frontend:**

```bash
railway variables --set "FRONTEND_URL=https://task-hive-psi.vercel.app"
```

**Or via Railway web:**
- Railway → Backend service → Variables
- Find or add `FRONTEND_URL`
- Set value to: `https://task-hive-psi.vercel.app`
- Save
- Redeploy Railway backend

---

## ✅ Verification Steps

### Step 1: Verify Frontend URL

**After redeploying Vercel, check:**
1. Open your Vercel site: `https://task-hive-psi.vercel.app`
2. Open browser console (F12)
3. Run this in console:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```
4. Should show: `https://taskhive-production-4dce.up.railway.app/api`
5. If it shows `undefined` → Environment variable not set or not redeployed!

### Step 2: Verify Backend is Up

**Test backend directly:**
```
https://taskhive-production-4dce.up.railway.app/health
```

**Should return:**
```json
{"status":"ok","message":"TaskHive API is running"}
```

### Step 3: Check Network Tab

**After both fixes:**
1. Try to log in again
2. Open Network tab
3. Click on the "login" request
4. Check "Headers" tab:
   - **Request URL:** Should be `https://taskhive-production-4dce.up.railway.app/api/auth/login`
   - **Status:** Should be 200 or 400/401 (not Network Error)

---

## 🐛 Still Not Working?

### Check Request URL

**In Network tab, what URL does the login request show?**
- ✅ Correct: `https://taskhive-production-4dce.up.railway.app/api/auth/login`
- ❌ Wrong: `http://localhost:5001/api/auth/login` → VITE_API_URL not set!

### Check Response Tab

**Click on failed request → Response tab:**
- What error message do you see?
- "CORS policy" error → FRONTEND_URL not set in Railway
- "Failed to fetch" → Backend not accessible
- "Network Error" → Wrong URL or backend down

### Check Railway Logs

```bash
railway logs
```

**Look for:**
- Any errors?
- Is the server running?
- CORS errors?

---

## 📋 Complete Checklist

- [ ] Added `VITE_API_URL` in Vercel (Settings → Environment Variables)
- [ ] Set value: `https://taskhive-production-4dce.up.railway.app/api`
- [ ] Selected all environments (Production, Preview, Development)
- [ ] **Redeployed Vercel** (important!)
- [ ] Set `FRONTEND_URL` in Railway: `https://task-hive-psi.vercel.app`
- [ ] Redeployed Railway backend (if changed FRONTEND_URL)
- [ ] Tested backend health endpoint
- [ ] Cleared browser cache
- [ ] Tested login again

---

**Most common issue: Forgetting to redeploy Vercel after adding the environment variable!** 

Environment variables only apply to NEW deployments, not existing ones.

