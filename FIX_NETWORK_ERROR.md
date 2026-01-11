# Fix Network Error - Set Environment Variable in Vercel

## 🐛 The Problem

Your frontend is trying to connect to `http://localhost:5001/api` (the fallback) instead of your Railway backend because the `VITE_API_URL` environment variable isn't set in Vercel.

## ✅ Solution: Add Environment Variable in Vercel

### Step 1: Go to Vercel Project Settings

1. **In Vercel Dashboard:**
   - Click on your project: **"task-hive"**
   - Click **"Settings"** tab (top navigation)

### Step 2: Go to Environment Variables

1. **In the left sidebar, click:** **"Environment Variables"**

### Step 3: Add the Variable

1. **Click:** **"Add New"** or **"Add Variable"** button

2. **Fill in:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://taskhive-production-4dce.up.railway.app/api`
   - **Environment:** Select all three:
     - ✅ **Production**
     - ✅ **Preview** 
     - ✅ **Development**

3. **Click:** **"Save"**

### Step 4: Redeploy

**After adding the variable, you need to redeploy:**

1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Or push a new commit (will auto-redeploy)

---

## 🔧 Alternative: Set via Vercel CLI

If you prefer using CLI:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Link to project (if not already linked)
cd frontend
vercel link

# Set environment variable
vercel env add VITE_API_URL production
# When prompted, enter: https://taskhive-production-4dce.up.railway.app/api

# Repeat for other environments
vercel env add VITE_API_URL preview
vercel env add VITE_API_URL development

# Redeploy
vercel --prod
```

---

## 🔄 Also Update Railway Backend CORS

**Your backend also needs to know about your Vercel frontend:**

1. **Update `FRONTEND_URL` in Railway:**

```bash
railway variables --set "FRONTEND_URL=https://task-hive-psi.vercel.app"
```

**Or via Railway web:**
- Railway → Backend service → Variables
- Edit `FRONTEND_URL`
- Set to: `https://task-hive-psi.vercel.app`
- Save and redeploy

---

## ✅ After Fixing

**Once you've:**
1. ✅ Added `VITE_API_URL` in Vercel
2. ✅ Redeployed Vercel frontend
3. ✅ Updated `FRONTEND_URL` in Railway
4. ✅ Redeployed Railway backend (if changed FRONTEND_URL)

**Test again:**
1. Open your Vercel URL: `https://task-hive-psi.vercel.app`
2. Try to log in
3. Check browser console (F12) → Network tab
4. You should see requests going to: `https://taskhive-production-4dce.up.railway.app/api/...`

---

## 🐛 Troubleshooting

### Still Getting Network Error?

**Check:**
1. Did you add `VITE_API_URL` in Vercel? (Settings → Environment Variables)
2. Did you redeploy after adding the variable? (Environment variables only apply to new deployments)
3. Is the backend URL correct? (Should be `https://taskhive-production-4dce.up.railway.app/api`)
4. Is Railway backend running? (Check `railway logs`)

### CORS Errors?

**If you see CORS errors in browser console:**
1. Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly
2. Redeploy Railway backend after changing `FRONTEND_URL`
3. Check that Railway backend CORS is configured correctly

### Backend Not Responding?

**Test backend directly:**
- Visit: `https://taskhive-production-4dce.up.railway.app/health`
- Should return: `{"status":"ok","message":"TaskHive API is running"}`

---

## 📋 Quick Checklist

- [ ] Added `VITE_API_URL` in Vercel Settings → Environment Variables
- [ ] Set value to: `https://taskhive-production-4dce.up.railway.app/api`
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed Vercel frontend
- [ ] Updated `FRONTEND_URL` in Railway to match Vercel URL
- [ ] Redeployed Railway backend (if changed FRONTEND_URL)
- [ ] Tested login again

---

**Once you add the environment variable and redeploy, the network error should be fixed!** 🚀

