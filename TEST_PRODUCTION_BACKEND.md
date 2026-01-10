# Testing Frontend with Production Backend

## ✅ Your Frontend is Configured!

Your `frontend/.env` is now set to:
```
VITE_API_URL=https://taskhive-production-4dce.up.railway.app/api
```

## 🚀 Next Steps to Test

### 1. Restart Your Dev Server

**If your dev server is running, stop it (Ctrl+C) and restart:**

```bash
cd frontend
npm run dev
```

**Important:** Environment variables are loaded when Vite starts, so you **must restart** the dev server for changes to take effect!

### 2. Open Your App

Your frontend should be running at: `http://localhost:5173` (or whatever port Vite shows)

### 3. Test the Connection

**Open your browser's Developer Tools (F12):**

#### Check Network Tab
1. Open **Network** tab
2. Try to login or perform any action
3. Look for API requests - they should go to:
   ```
   https://taskhive-production-4dce.up.railway.app/api/...
   ```
   **NOT** `http://localhost:5001/api/...`

#### Check Console
- Should not see any CORS errors
- Should see successful API responses

### 4. Test Basic Functionality

**Try these actions:**
- ✅ Login/Register
- ✅ Create a project
- ✅ View projects
- ✅ Create a task

**All API calls should go to your production backend!**

---

## 🐛 Troubleshooting

### API requests still go to localhost

**Solution:**
1. Make sure you restarted the dev server
2. Check browser cache - do a hard refresh (Ctrl+Shift+R)
3. Verify `.env` file is correct:
   ```bash
   Get-Content frontend\.env
   ```

### CORS errors

**If you see CORS errors:**
- Your backend CORS is configured for `FRONTEND_URL=http://localhost:5173`
- This should work, but if you get CORS errors, update Railway:

```bash
railway variables --set "FRONTEND_URL=http://localhost:5173"
```

### 401 Unauthorized errors

**If you see 401 errors:**
- Make sure you're testing with a real account (register/login first)
- Check that tokens are being saved in localStorage
- Verify JWT_SECRET is set in Railway

### 404 Not Found errors

**If you see 404 errors:**
- Check that the backend is running: `railway logs`
- Verify the backend URL is correct in `.env`
- Test backend health: `https://taskhive-production-4dce.up.railway.app/health`

---

## ✅ Success Indicators

**You'll know it's working when:**
- ✅ Network tab shows requests to `taskhive-production-4dce.up.railway.app`
- ✅ Login/Register works
- ✅ You can create projects
- ✅ No CORS errors in console
- ✅ Data persists (projects/tasks saved to production database)

---

## 🔄 Switch Back to Localhost (Later)

**When you want to use local backend again:**

1. Edit `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

2. Restart dev server

**Or create `frontend/.env.local`** to override without changing `.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 📊 What's Happening

- **Frontend:** Running locally on `http://localhost:5173`
- **Backend:** Running on Railway at `https://taskhive-production-4dce.up.railway.app`
- **Database:** PostgreSQL on Railway (production database)
- **All API calls:** Frontend → Production Backend → Production Database

---

**Now restart your dev server and test it!** 🚀

