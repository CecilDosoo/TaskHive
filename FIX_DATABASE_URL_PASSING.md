# Fix: DATABASE_URL is Set But Not Reaching Server

You have `DATABASE_URL` in Variables, but the server shows it as `undefined`. This means Railway isn't passing it to your app.

## Quick Fixes to Try

### Fix 1: Verify DATABASE_URL Has a Value

1. **In Variables tab**, find `DATABASE_URL`
2. **Click on it** or click the **three dots (⋯)** next to it
3. **Click "Reveal" or "Show"** to see the actual value
4. **Does it show a long string starting with `postgresql://`?**
   - ✅ YES - The value is there, continue to Fix 2
   - ❌ NO or EMPTY - You need to add the value (copy from PostgreSQL service)

### Fix 2: Check Variable Name (No Typos)

**Make sure the name is EXACTLY:**
- ✅ `DATABASE_URL` (all caps, underscore)
- ❌ NOT: `DATABASE-URL`, `database_url`, `DATABASE URL`, `DATABASE_URL ` (space at end)

### Fix 3: Force Redeploy After Adding Variable

**Sometimes Railway needs a fresh deployment:**

1. **Go to "Deployments" tab**
2. **Click "Redeploy" button** (top right)
3. **OR click three dots (⋯) on latest deployment → "Redeploy"**
4. **Wait for deployment to complete**
5. **Check logs** - should now show DATABASE_URL with a value

### Fix 4: Check if Services Are Linked

Railway might need PostgreSQL to be "linked" to backend:

1. **Backend service → Settings tab**
2. **Click "Deploy" section**
3. **Look for "Service Dependencies" or "Connected Services"**
4. **If you see PostgreSQL listed, it's linked ✅**
5. **If not, you might need to link them**

**OR check in Variables tab:**
- Do you see other variables from PostgreSQL? (like `PGHOST`, `PGPORT`, etc.)
- If yes, services are linked
- If no, they might not be linked

### Fix 5: Remove and Re-Add DATABASE_URL

Sometimes Railway needs you to remove and re-add:

1. **Variables tab**
2. **Find `DATABASE_URL`**
3. **Click three dots (⋯) → Delete**
4. **Wait 10 seconds**
5. **Click "+ New Variable"**
6. **Name:** `DATABASE_URL`
7. **Value:** Copy fresh from PostgreSQL service → Variables → DATABASE_URL
8. **Add it**
9. **Redeploy**

### Fix 6: Check Railway Service Configuration

1. **Settings → Deploy section**
2. **Look for "Environment Variables" or "Runtime Variables"**
3. **Make sure DATABASE_URL is listed there too**
4. **If not, add it there as well**

---

## Why This Happens

Railway should automatically pass Variables to your app, but sometimes:
- Variables need to be in a specific format
- Services need to be linked
- Railway needs a redeploy to pick up new variables
- There's a caching issue

---

## Test After Fix

After trying the fixes above:

1. **Redeploy**
2. **Check Deploy Logs**
3. **Look for:** `✅ DATABASE_URL is set: postgresql://...` (should show first 30 chars)
4. **Should NOT see:** `⚠️ WARNING: DATABASE_URL is not set!`

---

## If Still Not Working

**Check the actual value:**

1. **Click on `DATABASE_URL` in Variables**
2. **Click "Reveal"**
3. **What does it show?**
   - Is it empty?
   - Does it start with `postgresql://`?
   - Is it the full connection string?

**Also check:**
- Is PostgreSQL service showing as "Active" (not "Provisioning")?
- Did you copy the value from PostgreSQL service Variables?

---

## Quick Checklist

- [ ] DATABASE_URL exists in Variables tab ✅ (You have this!)
- [ ] DATABASE_URL has a value (click Reveal to check)
- [ ] Variable name is exactly `DATABASE_URL` (no typos)
- [ ] Value starts with `postgresql://`
- [ ] Redeployed after adding/verifying DATABASE_URL
- [ ] Check logs - still shows undefined?

