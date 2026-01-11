# Debug Network Error - Step by Step

## 🔍 What I See in Your Console

- ✅ CORS preflight requests are happening (status 204) - This means cross-origin requests are being attempted
- ❌ Login requests are failing (no status code, 0 B size)
- This suggests the requests might be going to the wrong URL or the backend isn't responding

## 🎯 Let's Debug Step by Step

### Step 1: Check What URL Your Frontend is Using

**In your browser console, run this:**

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5001/api');
```

**Or check the Network tab:**
1. Click on one of the failed "login" requests
2. Look at the "Headers" tab
3. Check the "Request URL" - what does it say?

**Expected:** Should be `https://taskhive-production-4dce.up.railway.app/api/auth/login`
**If you see:** `http://localhost:5001/api/auth/login` → Environment variable not set!

### Step 2: Verify Environment Variable in Vercel

1. **Go to Vercel Dashboard:**
   - Project: "task-hive"
   - Settings → Environment Variables
   - Check if `VITE_API_URL` exists
   - Value should be: `https://taskhive-production-4dce.up.railway.app/api`

2. **If it's missing or wrong:**
   - Add/Edit it
   - Make sure it's set for Production, Preview, and Development
   - **Important:** Redeploy after adding/changing environment variables!

### Step 3: Check if Backend is Accessible

**Test your backend directly:**

Open in browser or use curl:
```
https://taskhive-production-4dce.up.railway.app/health
```

**Expected response:**
```json
{"status":"ok","message":"TaskHive API is running"}
```

**If you get an error:**
- Backend might be down
- Check Railway logs: `railway logs`

### Step 4: Check CORS Configuration

**Your backend CORS needs to allow your Vercel frontend.**

**In Railway, check `FRONTEND_URL` variable:**
```bash
railway variables
```

**Should be set to:**
```
FRONTEND_URL=https://task-hive-psi.vercel.app
```

**If it's not set or wrong:**
```bash
railway variables --set "FRONTEND_URL=https://task-hive-psi.vercel.app"
```

Then redeploy Railway backend.

### Step 5: Check Browser Console for Actual Error

**In the Network tab:**
1. Click on the failed "login" request
2. Click "Response" tab - what error message do you see?
3. Click "Headers" tab - check:
   - Request URL (where is it going?)
   - Request Method (should be POST)
   - Response Headers (any CORS errors?)

**Common errors:**
- "CORS policy: No 'Access-Control-Allow-Origin' header" → CORS issue
- "Failed to fetch" → Backend not accessible
- "Network Error" → Wrong URL or backend down

---

## 🔧 Quick Fix Checklist

1. ✅ **Add `VITE_API_URL` in Vercel:**
   - Settings → Environment Variables
   - Key: `VITE_API_URL`
   - Value: `https://taskhive-production-4dce.up.railway.app/api`
   - Environments: All (Production, Preview, Development)

2. ✅ **Redeploy Vercel** (must do after adding env var!)

3. ✅ **Set `FRONTEND_URL` in Railway:**
   ```bash
   railway variables --set "FRONTEND_URL=https://task-hive-psi.vercel.app"
   ```

4. ✅ **Redeploy Railway** (if you changed FRONTEND_URL)

5. ✅ **Test backend health:**
   - Visit: `https://taskhive-production-4dce.up.railway.app/health`

6. ✅ **Clear browser cache and test again**

---

## 🐛 Common Issues

### Issue 1: Environment Variable Not Applied

**Symptom:** Requests going to `localhost:5001`

**Fix:**
- Make sure you **redeployed** Vercel after adding the variable
- Environment variables only apply to **new deployments**

### Issue 2: CORS Error

**Symptom:** Browser console shows CORS policy error

**Fix:**
- Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Redeploy Railway backend after changing it
- Check backend CORS configuration

### Issue 3: Backend Not Responding

**Symptom:** Request fails with "Failed to fetch" or timeout

**Fix:**
- Check Railway logs: `railway logs`
- Test backend directly: `https://taskhive-production-4dce.up.railway.app/health`
- Make sure backend service is running in Railway

---

**Please check the Request URL in the Network tab and let me know what it shows!** 🔍

