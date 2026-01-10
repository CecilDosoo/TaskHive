# Frontend Environment Variables Setup

## ✅ Files Created

I've created two environment variable files for you:

### 1. `.env` (Local Development)
- **Location:** `frontend/.env`
- **Content:** `VITE_API_URL=http://localhost:5001/api`
- **Purpose:** Use when running frontend locally with local backend
- **Status:** Ignored by Git (won't be committed)

### 2. `.env.production` (Production Builds)
- **Location:** `frontend/.env.production`
- **Content:** `VITE_API_URL=https://taskhive-production-4dce.up.railway.app/api`
- **Purpose:** Used automatically when building for production (`npm run build`)
- **Status:** Committed to Git (template for deployment)

---

## 🧪 How to Test with Production Backend

### Option 1: Temporarily Edit `.env` File

**Edit `frontend/.env` and change it to:**
```env
VITE_API_URL=https://taskhive-production-4dce.up.railway.app/api
```

**Then restart your dev server:**
```bash
cd frontend
npm run dev
```

**To switch back to localhost, change it back to:**
```env
VITE_API_URL=http://localhost:5001/api
```

### Option 2: Use `.env.local` (Recommended for Testing)

**Create `frontend/.env.local` (this file is gitignored):**
```env
VITE_API_URL=https://taskhive-production-4dce.up.railway.app/api
```

**`.env.local` takes priority over `.env`, so this will override the default.**

**To test with production:**
1. Create/edit `frontend/.env.local` with production URL
2. Restart dev server: `npm run dev`

**To go back to localhost:**
1. Delete `frontend/.env.local` or change it back
2. Restart dev server

---

## 🚀 How It Works

### During Development (`npm run dev`)

**Vite loads environment variables in this order (last one wins):**
1. `.env` - Default (localhost)
2. `.env.local` - Local overrides (gitignored)
3. `.env.production` - Production template (not used in dev mode)

**So if you have both `.env` and `.env.local`, `.env.local` takes priority.**

### During Production Build (`npm run build`)

**Vite loads:**
1. `.env.production` - Production settings
2. `.env.production.local` - Local production overrides (gitignored)

**Your `.env.production` already has the production backend URL, so it will automatically use it when you build for deployment!**

---

## 📝 Current Configuration

**Your `frontend/src/config/api.ts` already uses the environment variable:**

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
```

**This means:**
- If `VITE_API_URL` is set → use it
- Otherwise → fallback to `http://localhost:5001/api`

---

## 🧪 Test It Now!

**To test with production backend:**

1. **Create/edit `frontend/.env.local`:**
   ```env
   VITE_API_URL=https://taskhive-production-4dce.up.railway.app/api
   ```

2. **Restart your dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your app and try to:**
   - Login
   - Create a project
   - Any API call

4. **Check browser console** - you should see requests going to:
   ```
   https://taskhive-production-4dce.up.railway.app/api/...
   ```

5. **Check Network tab** - verify requests are going to production backend

---

## 🔄 Switching Between Localhost and Production

### Use Localhost Backend (Default)
- Keep `.env` as is: `VITE_API_URL=http://localhost:5001/api`
- Delete or don't create `.env.local`

### Use Production Backend
- Create/edit `.env.local`: `VITE_API_URL=https://taskhive-production-4dce.up.railway.app/api`

**Remember:** After changing environment variables, **restart your dev server**!

---

## 🎯 Quick Commands

```bash
# Test with production backend
echo "VITE_API_URL=https://taskhive-production-4dce.up.railway.app/api" > frontend/.env.local
npm run dev

# Switch back to localhost
rm frontend/.env.local  # or delete the file manually
npm run dev

# Build for production (automatically uses .env.production)
npm run build
```

---

## ✅ Summary

- ✅ `.env` created for local development (localhost)
- ✅ `.env.production` created for production builds (Railway URL)
- ✅ `.gitignore` updated to ignore `.env` but keep `.env.production`
- ✅ Your frontend will automatically use the correct backend URL based on mode

**To test now:** Create `frontend/.env.local` with the production URL and restart your dev server!

