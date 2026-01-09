# Verify DATABASE_URL is Actually Set

Let's double-check everything to make sure DATABASE_URL is set correctly.

## ✅ Verification Checklist

### 1. Confirm DATABASE_URL is in BACKEND Service (Not PostgreSQL)

**In Railway:**

1. **Click on your BACKEND service** (TaskHive/backend card - NOT PostgreSQL)
2. **Click "Variables" tab**
3. **Look at the list of variables**
4. **Do you see `DATABASE_URL` in that list?** 
   - ✅ YES - Continue to Step 2
   - ❌ NO - You need to add it (see HOW_TO_ADD_DATABASE_URL.md)

### 2. Verify DATABASE_URL Has a Value

**Still in backend Variables tab:**

1. **Find `DATABASE_URL` in the list**
2. **Does it show dots/asterisks?** (That's normal - values are hidden)
3. **Click "Reveal" or "Show" or the eye icon** next to it
4. **Does it show a long string starting with `postgresql://`?**
   - ✅ YES - The value is there! Continue to Step 3
   - ❌ NO - The value is empty. You need to add the value from PostgreSQL

### 3. Verify the Value is Complete

**When you click "Reveal" on DATABASE_URL, it should look like:**

```
postgresql://postgres:somepassword@containers-us-west-123.railway.app:5432/railway?sslmode=require
```

**Is it:**
- ✅ Very long (at least 50+ characters)?
- ✅ Starts with `postgresql://` or `postgres://`?
- ✅ Contains `@` and `:` symbols?
- ✅ Ends with something like `?sslmode=require`?

**If NO to any of these:**
- The value might be incomplete or wrong
- Go back to PostgreSQL service and copy it again

### 4. Check for Typos in Variable Name

**In backend Variables, check the NAME of the variable:**

- ✅ Is it exactly: `DATABASE_URL` (no spaces, no dashes, all caps)?
- ❌ Is it: `DATABASE-URL` or `database_url` or `DATABASE URL`? (WRONG!)

**The name MUST be exactly:** `DATABASE_URL` (case sensitive!)

### 5. Did You Redeploy After Adding It?

**After adding DATABASE_URL, you MUST redeploy:**

1. **Did you redeploy after adding DATABASE_URL?** (Yes/No)
2. **If NO:** 
   - Go to "Deployments" tab
   - Click "Redeploy" button
   - Wait 1-2 minutes
3. **If YES:**
   - Continue to Step 6

### 6. Check If Variables Are Loading

**After redeploying, check the logs:**

1. **Go to Deployments → Latest deployment → Deploy Logs**
2. **Look at the very beginning of the logs**
3. **Do you see:** `DATABASE_URL: undefined` or `DATABASE_URL: postgresql://...`?

**If it still shows `undefined`:**
- The variable might not be set correctly
- Try removing it and adding it again
- Make sure you're adding it to BACKEND service, not PostgreSQL

---

## 🔍 Debugging Steps

### Step A: Remove and Re-Add DATABASE_URL

Sometimes Railway needs you to remove and re-add:

1. **Backend service → Variables tab**
2. **Find `DATABASE_URL`**
3. **Click the delete/trash icon** (remove it)
4. **Confirm deletion**
5. **Click "+ New Variable"**
6. **Name:** `DATABASE_URL` (exactly)
7. **Value:** Copy from PostgreSQL again (fresh copy)
8. **Click "Add"**
9. **Redeploy**

### Step B: Check Railway Settings

1. **Backend service → Settings tab**
2. **Scroll down to "Environment Variables" or "Variables" section**
3. **Does it show DATABASE_URL there?**
4. **If not, add it here instead of Variables tab**

### Step C: Verify Railway.json Isn't Overriding

Check if `railway.json` has any variable settings that might override:

1. **Look at `backend/railway.json`**
2. **Does it have a "variables" section?**
3. **If yes, DATABASE_URL should be there too (or removed)**

---

## 🚨 If Still Not Working

### Alternative: Set in Railway Settings Instead

1. **Backend service → Settings tab**
2. **Look for "Environment Variables" section**
3. **Add DATABASE_URL here instead**
4. **Redeploy**

### Alternative: Use Railway CLI to Set Variable

If the web interface isn't working:

1. **Install Railway CLI:** `npm i -g @railway/cli`
2. **Login:** `railway login`
3. **Link project:** `railway link`
4. **Set variable:** `railway variables set DATABASE_URL="paste-value-here"`

---

## 📋 Final Checklist

Before saying "I did everything", verify:

- [ ] DATABASE_URL is in BACKEND service Variables (not PostgreSQL)
- [ ] Variable name is exactly `DATABASE_URL` (no typos, all caps)
- [ ] Variable has a value (click Reveal to check)
- [ ] Value is complete and starts with `postgresql://`
- [ ] You redeployed after adding it
- [ ] Logs still show the error? (If yes, what's the exact error now?)

---

## ❓ Tell Me:

1. **Do you see `DATABASE_URL` in backend Variables tab?** (Yes/No)
2. **When you click "Reveal", does it show a value?** (Yes/No)
3. **Did you redeploy after adding it?** (Yes/No)
4. **After redeploy, what error do you see now?** (Is it still "Environment variable not found" or different error?)

