# Fix: Root Directory Setting in Railway

## The Problem

Railway is not passing ANY environment variables (DATABASE_URL, JWT_SECRET, etc.) to your app. This almost always means **Root Directory is set incorrectly**.

## The Fix

### Step 1: Check Root Directory Setting

1. **In Railway**, go to your **backend service**
2. **Click "Settings" tab**
3. **Click "Deploy" section** (from the list: Source, Networking, Build, **Deploy**, etc.)
4. **Scroll down and find "Root Directory"** field
5. **What does it say?**
   - ✅ `backend` (correct!)
   - ❌ `.` or empty or `/` (WRONG - change to `backend`)
   - ❌ Something else (change to `backend`)

### Step 2: Fix Root Directory

**If Root Directory is NOT `backend`:**

1. **Click on the Root Directory field**
2. **Change it to:** `backend`
3. **Click "Save" or "Update"**
4. **Wait for it to save**

### Step 3: Redeploy

1. **Go to "Deployments" tab**
2. **Click "Redeploy" button** (top right)
3. **Wait 1-2 minutes for deployment**
4. **Check logs** - should now show variables!

---

## Why This Happens

**Root Directory tells Railway:**
- Which folder is your actual service code
- Where to inject environment variables
- What context to use for Variables

**If Root Directory is wrong:**
- Railway might build from root (`/`)
- But Variables are scoped to "backend" service
- They don't match up → variables don't get passed ❌

**If Root Directory is correct (`backend`):**
- Railway builds from `/backend` folder
- Variables match the service context
- Variables get passed correctly ✅

---

## Expected Result After Fix

After fixing Root Directory and redeploying, logs should show:

```
🔍 Environment Variables Check:
  NODE_ENV: production
  PORT: 8080
  DATABASE_URL: postgresql://postgres:cWiKqyczCa... ✅ (NOT UNDEFINED!)
  JWT_SECRET: SET ✅
  FRONTEND_URL: http://localhost:5173
✅ DATABASE_URL is available!
```

---

## Alternative: If Root Directory is Already `backend`

If Root Directory is already set to `backend` and it still doesn't work:

1. **Try changing it to:** `.` (dot/current)
2. **Save**
3. **Change it back to:** `backend`
4. **Save**
5. **Redeploy**

This forces Railway to refresh the configuration.

---

## Still Not Working?

If Root Directory is correct but variables still aren't passing:

1. **Try removing all variables**
2. **Save**
3. **Add them back one by one**
4. **Redeploy after each addition**

Or use Railway CLI:
```bash
npm i -g @railway/cli
railway login
railway link
railway variables set DATABASE_URL="your-value"
```

---

## Tell Me:

**After you check Settings → Deploy → Root Directory:**
1. **What is Root Directory currently set to?**
2. **After changing it to `backend` and redeploying, what do the logs show?**

This should fix it! 🎯

