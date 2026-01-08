# Fix Railway Deployment Error

## Problem
Railway is showing: **"Error creating build plan with Railpack"**

This happens because Railway can't detect your build configuration in a monorepo structure.

## Solution 1: Set Root Directory in Railway Dashboard (Easiest)

1. Go to your Railway project dashboard
2. Click on your **backend service**
3. Go to **Settings** tab
4. Scroll down to **"Root Directory"**
5. Set it to: `backend`
6. Click **"Save"**
7. Go to **Deployments** tab
8. Click **"Redeploy"** or trigger a new deployment

---

## Solution 2: Use railway.json in Root (Alternative)

I've created a `railway.json` in the root directory that points to the backend folder.

**Commit and push this file:**
```bash
git add railway.json
git commit -m "Add Railway config for monorepo"
git push origin main
```

Then in Railway:
1. Go to your service → **Settings**
2. Make sure **Root Directory** is set to `.` (root) or leave it empty
3. Railway will use the `railway.json` from root
4. Redeploy

---

## Solution 3: Manual Build Configuration

If the above don't work, set these manually in Railway:

1. Go to your backend service → **Settings**
2. Set **Root Directory**: `backend`
3. Set **Build Command**: 
   ```
   npm install && npm run prisma:generate && npm run build
   ```
4. Set **Start Command**:
   ```
   npm run start
   ```
5. Save and redeploy

---

## Verify Your Setup

After fixing, check:

1. **Root Directory** is set correctly (`backend` for backend service)
2. **Build Command** includes:
   - `npm install`
   - `npm run prisma:generate` (generates Prisma client)
   - `npm run build` (compiles TypeScript)
3. **Start Command** is: `npm run start`
4. **Environment Variables** are set (especially `DATABASE_URL`)

---

## Common Issues

### "Cannot find module"
- Make sure `Root Directory` is set to `backend`
- Check that `package.json` exists in `backend/`

### "Prisma Client not generated"
- Make sure build command includes `npm run prisma:generate`
- Check that `DATABASE_URL` is set before build

### "Port already in use"
- Railway auto-assigns PORT, make sure your code uses `process.env.PORT`

---

## Next Steps After Successful Build

1. **Run migrations**:
   - Go to your service → Deployments → Latest deployment → Terminal
   - Run: `npx prisma migrate deploy`

2. **Check logs**:
   - Go to Deployments → View logs
   - Make sure server starts without errors

3. **Test the API**:
   - Get your Railway URL
   - Test: `https://your-app.up.railway.app/api/health` (if you have a health endpoint)

---

## Still Having Issues?

1. Check Railway logs for specific error messages
2. Verify all environment variables are set
3. Make sure `DATABASE_URL` is from the PostgreSQL service
4. Check that `NODE_ENV=production` is set

