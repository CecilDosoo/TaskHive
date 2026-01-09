# QUICK FIX: Add DATABASE_URL Now!

The error shows `DATABASE_URL` is NOT set in your backend service.

## ⚠️ CRITICAL: Add DATABASE_URL Right Now

Follow these steps EXACTLY:

---

## ✅ Step-by-Step (Do This Right Now)

### 1. Check: Do You Have PostgreSQL?

**In Railway:**
- Look at your project
- **Count the cards/services** you see
- Do you see:
  - ✅ Backend service (TaskHive/backend)? 
  - ✅ PostgreSQL service (separate card)?

**If NO PostgreSQL service:**
- Click **"New"** button (top right)
- Click **"Database"**
- Click **"Add PostgreSQL"**
- Wait 1-2 minutes for it to be created

**If YES, you have PostgreSQL:**
- Continue to step 2

---

### 2. Get DATABASE_URL from PostgreSQL

1. **Click on the PostgreSQL service card** (NOT your backend card)
2. **Click "Variables" tab** (at the top)
3. **Find `DATABASE_URL`** in the list
4. **Click the COPY icon** (two squares) next to it, OR
5. **Click "Reveal"** to see the full value, then copy it manually
6. **Make sure you copied the ENTIRE thing!** It's very long.

---

### 3. Add DATABASE_URL to Backend (IMPORTANT!)

**Now go to your BACKEND service:**

1. **Click on your BACKEND service card** (TaskHive/backend - NOT PostgreSQL)
2. **Click "Variables" tab** (at the top)
3. **Look for a button:**
   - "+ New Variable" or
   - "Add Variable" or
   - Just a "+" icon
4. **Click it**
5. **Two fields appear:**
   - **LEFT field (Name/Key):** Type: `DATABASE_URL` (exactly like this, all caps)
   - **RIGHT field (Value):** Paste the DATABASE_URL you copied from PostgreSQL
6. **Click "Add" or "Save"**
7. **Verify it appears in the list** - you should see `DATABASE_URL` now!

---

### 4. Verify It's Really There

**Double-check:**

1. **In backend service Variables tab**
2. **Do you see `DATABASE_URL`?** ✅
3. **Click "Reveal" or "Show"** next to it
4. **Does it show a long string starting with `postgresql://`?** ✅

**If YES** → Good! Continue to Step 5
**If NO** → You didn't add it correctly. Try again from Step 3.

---

### 5. Redeploy Backend

1. **Still in backend service**
2. **Click "Deployments" tab**
3. **Click "Redeploy" button** (top right) or three dots → "Redeploy"
4. **Wait 1-2 minutes**
5. **Check logs** - should NOT see "Environment variable not found: DATABASE_URL" anymore!

---

## ✅ Success Checklist

After redeploying, check the logs:

- [ ] No error about "Environment variable not found: DATABASE_URL"
- [ ] Server starts successfully
- [ ] See "Server running on port XXXX" in logs
- [ ] Server stays running (doesn't crash)

---

## 🚨 Common Mistakes

### ❌ "I added it to PostgreSQL Variables"
- **WRONG!** PostgreSQL Variables are just for PostgreSQL itself
- **RIGHT!** Add it to BACKEND service Variables

### ❌ "I typed it in wrong"
- **Name must be:** `DATABASE_URL` (exactly, all caps, underscore)
- **Value must be:** The full string from PostgreSQL (starts with `postgresql://`)

### ❌ "I don't see the Variables tab"
- Make sure you clicked on the SERVICE card first
- Variables tab appears AFTER you click into a service

### ❌ "It shows dots/asterisks"
- That's normal - values are hidden for security
- Click "Reveal" or "Show" to see the actual value
- The important thing is that DATABASE_URL EXISTS in the list

---

## 🎯 The Key Point

**You need DATABASE_URL in TWO places:**
1. ✅ PostgreSQL service (Railway creates this automatically)
2. ❌ Backend service (YOU need to copy it here manually!)

The error happens because #2 is missing!

---

## Still Not Working?

Tell me:
1. **Do you see PostgreSQL service?** (Yes/No)
2. **Did you add DATABASE_URL to BACKEND Variables?** (Yes/No)
3. **What do you see in backend Variables tab now?** (List of variables or empty?)
4. **After redeploy, what's the FIRST error message you see?**

