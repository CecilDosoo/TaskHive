# Fix DATABASE_URL Showing as Undefined

Your server is running, but `DATABASE_URL` is still `undefined`. This means Railway isn't passing the variable to your app.

## Why This Happens

Railway should automatically provide `DATABASE_URL` when PostgreSQL is linked to your backend service, but sometimes you need to manually link them.

## Solution 1: Link PostgreSQL Service (Recommended)

### Step 1: Check if Services are Linked

1. **In Railway**, go to your **backend service**
2. **Click "Settings" tab**
3. **Look for a section called:**
   - "Connected Services"
   - "Service Dependencies" 
   - "Links"
   - "Variables" (and see if it shows PostgreSQL variables)

### Step 2: Link PostgreSQL to Backend

**If they're NOT linked:**

1. **In your backend service → Settings tab**
2. **Look for "Service Dependencies" or "Connected Services"**
3. **Click "Add Service" or "Link Service"**
4. **Select your PostgreSQL service**
5. **Save**

**OR:**

1. **In Railway**, at the project level
2. **Look for a way to "link" or "connect" services**
3. **Connect PostgreSQL to your backend**

**OR use Railway's automatic linking:**

1. **In your backend service → Variables tab**
2. **Click "+ New Variable"**
3. **Instead of typing the name, look for a dropdown or "Reference" option**
4. **If you see "Reference from PostgreSQL" or similar, use that**
5. **Select `DATABASE_URL` from PostgreSQL**

---

## Solution 2: Manually Add DATABASE_URL (If Linking Doesn't Work)

### Step 1: Get DATABASE_URL from PostgreSQL

1. **Click on PostgreSQL service**
2. **Variables tab**
3. **Find `DATABASE_URL`**
4. **Copy the ENTIRE value** (click copy icon or Reveal then copy)

### Step 2: Add to Backend (AGAIN - Double Check)

1. **Go to BACKEND service** (not PostgreSQL)
2. **Variables tab**
3. **Look for `DATABASE_URL`** - is it there?
4. **If NO:** Add it (Name: `DATABASE_URL`, Value: paste from PostgreSQL)
5. **If YES:** Click on it to edit
   - Make sure the VALUE is correct
   - Make sure there are no extra spaces
   - Make sure you copied the ENTIRE string

### Step 3: Verify in Railway Settings

Sometimes Variables tab doesn't work, try Settings:

1. **Backend service → Settings tab**
2. **Scroll down to "Environment Variables" or "Variables" section**
3. **Add DATABASE_URL here if not in Variables tab**
4. **Save**

### Step 4: Force Redeploy

1. **Deployments tab**
2. **Click three dots (⋯) on latest deployment**
3. **Click "Redeploy"** (not just rebuild)
4. **Or push a new commit to trigger fresh deployment**

---

## Solution 3: Use Railway's Service Reference Syntax

Railway has a special syntax to reference variables from other services:

1. **Backend service → Variables tab**
2. **Add variable:**
   - **Name:** `DATABASE_URL`
   - **Value:** Try one of these formats:
     - `${{PostgreSQL.DATABASE_URL}}`
     - `${{PGDATABASE}}`
     - Or just paste the actual value from PostgreSQL

---

## Solution 4: Check Railway Service Configuration

### Verify Root Directory is Correct

1. **Backend service → Settings**
2. **Find "Root Directory"**
3. **Should be:** `backend` (not `.` or empty)
4. **If wrong, change it and redeploy**

---

## Debug: Why DATABASE_URL is Undefined

The log shows `DATABASE_URL: undefined` which means:

1. ✅ Environment variables ARE being loaded (dotenv works)
2. ❌ But DATABASE_URL specifically is not set

**Possible reasons:**
- Variable name is wrong (typo, case mismatch)
- Variable is in PostgreSQL service, not backend service
- Services aren't linked
- Railway needs a redeploy after adding variable
- Root directory setting is wrong

---

## Quick Test: Check What Variables ARE Available

Let's see what Railway is actually passing. I'll update the server to log all environment variables (carefully, without exposing secrets).

---

## Next Steps

1. **Try Solution 1 first** (Link PostgreSQL service)
2. **If that doesn't work, try Solution 2** (Manually verify DATABASE_URL)
3. **Check Railway documentation** for your specific Railway plan/version

**Most likely fix:** Services need to be linked, OR you need to manually copy DATABASE_URL and make absolutely sure it's in the BACKEND service Variables (not PostgreSQL).

---

## After Fixing DATABASE_URL

Once DATABASE_URL is set correctly:

1. **Redeploy**
2. **Check logs** - should see: `DATABASE_URL: postgresql://...` (not undefined)
3. **Server should be able to connect to database**
4. **Then we can run migrations**

---

## Tell Me:

1. **In backend service → Variables tab, do you see DATABASE_URL?** (Yes/No)
2. **When you click Reveal on it, what does it show?** (Value or empty?)
3. **In backend service → Settings, do you see a "Connected Services" or "Links" section?**
4. **What's your "Root Directory" set to in Settings?** (`backend` or something else?)

