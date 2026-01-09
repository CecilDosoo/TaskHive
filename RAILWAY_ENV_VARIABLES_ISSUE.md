# Fix: DATABASE_URL Set in Railway But Still Undefined

You have DATABASE_URL set correctly in Railway Variables, but the server shows it as `undefined`. This means Railway isn't passing it to the Node.js runtime.

## Why This Happens

Railway should automatically inject Variables as environment variables, but sometimes:
1. Variables need to be explicitly "attached" to the service
2. Railway needs services to be "linked" via Service Dependencies
3. There's a caching issue that needs a full redeploy
4. The Root Directory setting might be affecting variable injection

## Solution 1: Check Service Dependencies/Links

Railway needs PostgreSQL to be "linked" to backend:

### In Railway Dashboard:

1. **Backend service → Settings tab**
2. **Click "Deploy" section** (from the list you showed me)
3. **Look for:**
   - "Service Dependencies"
   - "Connected Services" 
   - "Environment Variables" section
   - Any mention of PostgreSQL

4. **If you see "Add Service" or "Link Service"**:
   - Click it
   - Select PostgreSQL
   - Save

### OR Check in Variables Tab:

1. **Variables tab** (not Settings)
2. **Look for variables that start with `PG`** (Railway auto-adds these when linked):
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`
   
3. **If you see these `PG*` variables:**
   - Services ARE linked ✅
   - But your code needs `DATABASE_URL`, not `PGDATABASE`
   - Solution: Use `PGDATABASE` or create `DATABASE_URL` that references it

---

## Solution 2: Use Railway's Reference Syntax

Railway might need you to reference the variable from PostgreSQL:

1. **Backend service → Variables tab**
2. **Find `DATABASE_URL`**
3. **Click to edit it**
4. **In the value field, try one of these formats:**
   - `${{PostgreSQL.DATABASE_URL}}` (Railway reference syntax)
   - `${{PGDATABASE}}` (if Railway auto-provides PGDATABASE)
   - Or just keep the actual value you have

---

## Solution 3: Check Root Directory Setting

Railway might not be injecting variables if Root Directory is wrong:

1. **Settings → Deploy section**
2. **Find "Root Directory"**
3. **Should be:** `backend` (or `.` if root is backend)
4. **If it's wrong, fix it and redeploy**

---

## Solution 4: Force Complete Redeploy

Sometimes Railway caches old variable state:

1. **Deployments tab**
2. **Click three dots (⋯) on latest deployment**
3. **Click "Redeploy"** (full redeploy, not just rebuild)
4. **Wait for it to complete**
5. **Check logs immediately after start**

---

## Solution 5: Check if Variables Are "Attached"

In Railway, sometimes variables need to be explicitly "attached" to a service:

1. **Variables tab**
2. **Look for each variable** - do they have a "scope" or "service" indicator?
3. **Make sure `DATABASE_URL` is scoped to your backend service**
4. **If there's an "Attach" or "Scope" option, use it**

---

## Solution 6: Temporary Workaround - Hardcode Test

Let's verify Railway CAN pass variables:

1. **Variables tab**
2. **Add a test variable:**
   - Name: `TEST_VAR`
   - Value: `hello-world`
3. **Redeploy**
4. **Check logs** - do you see `TEST_VAR`?
5. **If YES:** Railway works, issue is specific to DATABASE_URL
6. **If NO:** Railway isn't passing ANY variables (bigger issue)

---

## Solution 7: Check Railway Plan/Limitations

Some Railway plans or configurations have limitations:

1. **Check your Railway plan** (free tier might have limits)
2. **Check if there's a "Variables" limit** you've hit
3. **Check Railway status page** for issues

---

## Debug: What I Added to Code

I've updated `server.ts` to log ALL environment variables. After you redeploy with the new code:

1. **Check Deploy Logs**
2. **Look for the "Environment Check" section**
3. **Tell me what it shows for:**
   - `DATABASE_URL:` (should show the value, not UNDEFINED)
   - `JWT_SECRET:` (should show SET or UNDEFINED)
   - `PORT:` (should show the port number)

This will tell us if Railway is passing ANY variables, or just missing DATABASE_URL specifically.

---

## Most Likely Fix

**Try this in order:**

1. ✅ **Variables tab → DATABASE_URL exists** (You have this!)
2. ⚠️ **Check if services are linked** (Settings → Deploy → Service Dependencies)
3. ⚠️ **Redeploy** (Deployments → Redeploy button)
4. ⚠️ **Check Root Directory** (Settings → Deploy → Root Directory = `backend`)

---

## Next Steps

1. **Commit and push the updated server.ts** (I added better debugging)
2. **Wait for Railway to redeploy**
3. **Check the new logs** - look for "Environment Check" section
4. **Tell me what it shows** - especially the DATABASE_URL line

This will help us figure out if Railway is passing variables at all, or just missing DATABASE_URL specifically.

