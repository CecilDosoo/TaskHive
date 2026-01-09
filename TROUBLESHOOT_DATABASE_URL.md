# Troubleshoot DATABASE_URL Not Working

If you've added DATABASE_URL but it's still showing as not found, try these solutions:

## Issue 1: Railway Variables Not Available During Build

**Problem:** Railway might not pass variables to the build phase.

**Solution:** Make sure DATABASE_URL is set, and Railway should pass it during both build and runtime.

## Issue 2: Variables Need to Be in Specific Place

**In Railway, DATABASE_URL needs to be set in TWO ways:**

### Method A: In Variables Tab (What You Did)
✅ Backend service → Variables tab → Add DATABASE_URL

### Method B: In Settings → Environment Variables (Try This Too)
1. Backend service → **Settings** tab
2. Scroll to **"Environment Variables"** section (if it exists)
3. Add DATABASE_URL here as well
4. Redeploy

## Issue 3: Variable Name Typo

**Check the exact name:**
- ✅ CORRECT: `DATABASE_URL` (all caps, underscore)
- ❌ WRONG: `DATABASE-URL`, `database_url`, `DATABASE URL`, `DATABASE_URL ` (space at end)

## Issue 4: Railway Caching

**Try this:**
1. Remove DATABASE_URL from Variables
2. Save
3. Wait 30 seconds
4. Add DATABASE_URL again (fresh copy from PostgreSQL)
5. Save
6. Redeploy (force a new deployment)

## Issue 5: Build Command Running Before Variables Load

**Current build command:** `npm install && npm run prisma:generate && npm run build`

**The issue:** `prisma:generate` might be trying to validate the schema which needs DATABASE_URL.

**Let's fix this by making prisma:generate work without DATABASE_URL:**

Actually, `prisma generate` should work without DATABASE_URL. But if it's trying to validate, we can skip validation during build.

## Issue 6: Check Railway Service Settings

1. Backend service → **Settings** tab
2. Look for **"Root Directory"** - should be: `backend` or `.`
3. If it's set wrong, change it and redeploy

## Issue 7: Verify in Logs

**After adding DATABASE_URL and redeploying:**

1. Go to Deployments → Latest deployment → **Deploy Logs**
2. At the very start, look for any lines that show:
   - `DATABASE_URL=...` (should show the value)
   - `DATABASE_URL: undefined` (this means it's not set)

**What do you see?**

## Issue 8: Use Railway CLI to Verify

If the web interface isn't working, use Railway CLI:

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. List variables: `railway variables`
5. Set variable: `railway variables set DATABASE_URL="your-value-here"`

## Issue 9: Check if Service is Linked to Database

In Railway:
1. Backend service → **Settings** tab
2. Look for **"Connected Services"** or **"Links"**
3. PostgreSQL should be linked/connected to your backend
4. If not linked, Railway should auto-connect, but you can manually link them

## Issue 10: Alternative - Set in Railway.json

Add DATABASE_URL directly in `railway.json` (but this exposes it - not ideal for production):

```json
{
  "deploy": {
    "startCommand": "npm run start",
    "variables": {
      "DATABASE_URL": "${{PostgreSQL.DATABASE_URL}}"
    }
  }
}
```

But Railway should auto-provide this if services are linked.

---

## 🎯 Most Likely Solutions

### Try This First:

1. **Verify DATABASE_URL exists:**
   - Backend service → Variables tab
   - Do you see it? ✅
   - Click Reveal - does it have a value? ✅

2. **Force a fresh deployment:**
   - Deployments tab
   - Click three dots on latest → **"Redeploy"** (not "Rebuild")
   - Or push a new commit to GitHub to trigger deployment

3. **Check logs for variable loading:**
   - Look at Deploy Logs from the very start
   - Does it show DATABASE_URL anywhere?

4. **Try removing and re-adding:**
   - Delete DATABASE_URL from Variables
   - Wait 10 seconds
   - Add it again (fresh copy)
   - Redeploy

---

## ❓ Tell Me:

1. **When you look at backend Variables tab right now, do you see DATABASE_URL?** (Yes/No)
2. **If yes, when you click Reveal, what does it show?** (Value or empty?)
3. **After your last redeploy, what's the FIRST error message in Deploy Logs?** (Copy/paste it)
4. **What's your "Root Directory" set to in Settings?** (`backend` or `.` or something else?)

