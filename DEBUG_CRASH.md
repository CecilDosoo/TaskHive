# Debug Why Server Keeps Crashing

The server starts successfully but then crashes. Let's find out why.

## Step 1: Check the Crash Error in Logs

We need to see the actual error message to fix it.

### How to Check Logs:

1. **Go to Railway** → Your backend service
2. **Click "Deployments" tab**
3. **Find the crashed deployment** (it will show "Failed" or have a red indicator)
4. **Click on the crashed deployment** (click the deployment card)
5. **Click "Deploy Logs" tab**
6. **Scroll to the VERY BOTTOM** of the logs
7. **Look for the last error message** before it crashed

**Common errors you might see:**
- `Error: P1001: Can't reach database server` → DATABASE_URL is wrong or database isn't accessible
- `Error: Environment variable not found: DATABASE_URL` → DATABASE_URL isn't set in backend
- `Error: connect ECONNREFUSED` → Can't connect to database
- `Error: relation "User" does not exist` → Migrations haven't run yet
- `Prisma Client validation error` → Database schema doesn't match code

**What's the LAST error message you see before it crashes?**

---

## Step 2: Verify DATABASE_URL is Actually Set

Even if you added it, let's double-check:

1. **Go to backend service** → **"Variables" tab**
2. **Look for `DATABASE_URL`** in the list
3. **Does it show a value?** (might be hidden with dots)
4. **Click "Reveal" or "Show"** to see if it has a value
5. **The value should start with:** `postgresql://` or `postgres://`

**If DATABASE_URL is missing or empty:**
- Follow the steps in `HOW_TO_ADD_DATABASE_URL.md` to add it

**If DATABASE_URL is there:**
- The problem might be something else (see Step 3)

---

## Step 3: Check What Happens After "Server running"

The logs probably show:
```
🚀 Server running on port 8080
Environment: production
```

Then what happens after that? Does it:
- Try to connect to database?
- Show a Prisma error?
- Show a connection refused error?
- Just stop/crash?

**What happens right after "Server running"?**

---

## Step 4: Common Fixes

### Fix 1: DATABASE_URL Not Set (Most Common)

**If logs show:** `DATABASE_URL: undefined` or `Environment variable not found`

**Fix:**
1. Make sure you added DATABASE_URL in **backend service** Variables (not PostgreSQL)
2. Make sure the name is exactly `DATABASE_URL` (case sensitive)
3. Redeploy after adding it

### Fix 2: DATABASE_URL Wrong Format

**If logs show:** `Can't reach database server` or `Connection refused`

**Fix:**
1. Make sure you copied the ENTIRE DATABASE_URL from PostgreSQL service
2. It should start with `postgresql://` not `postgres://`
3. Make sure there are no extra spaces before/after the value

### Fix 3: Database Not Ready Yet

**If logs show:** `Connection timeout` or `ECONNREFUSED`

**Fix:**
1. Make sure PostgreSQL service shows "Active" (not "Provisioning")
2. Wait a few more minutes if it was just created
3. Try redeploying backend after PostgreSQL is fully ready

### Fix 4: Migrations Need to Run

**If logs show:** `relation "User" does not exist` or schema errors

**Fix:**
- Server started but database tables don't exist yet
- We'll run migrations after server stays running

---

## Quick Diagnostic Questions

Please answer these:

1. **What's the exact error message** at the bottom of the Deploy Logs?
2. **Is DATABASE_URL in your backend Variables?** (Yes/No)
3. **Does DATABASE_URL have a value?** (Check by clicking "Reveal")
4. **What do you see right after "Server running on port XXXX"** in the logs?
5. **Is PostgreSQL service showing "Active"?** (not "Provisioning")

Once I know these answers, I can tell you exactly how to fix it!

---

## Temporary Fix: Make Server Not Crash on DB Error

If the server crashes because it can't connect to the database, we might need to make the database connection optional at startup. But first, let's see what the actual error is.

