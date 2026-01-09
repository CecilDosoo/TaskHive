# Fix DATABASE_URL Error

The error is clear: **`DATABASE_URL` environment variable is not set** in Railway.

## Quick Fix Steps

### Step 1: Change Start Command (So Server Can Start)

1. **Go to Railway** → Your backend service
2. **Click "Settings" tab**
3. **Find "Start Command"** section
4. **Change it from:** `npm run start:migrate`
5. **Change it to:** `npm run start`
6. **Click "Save"**

This will let the server start even without DATABASE_URL set.

---

### Step 2: Add DATABASE_URL (Important!)

You need to add the `DATABASE_URL` from your PostgreSQL service:

#### A. Get DATABASE_URL from PostgreSQL Service

1. **In Railway**, look for your **PostgreSQL** service card
   - If you don't see one, you need to add it first (see Step 2B below)
   
2. **Click on the PostgreSQL service**

3. **Go to "Variables" tab**

4. **Find `DATABASE_URL`** in the list

5. **Click the copy icon** or manually copy the entire value
   - It looks like: `postgresql://postgres:password@hostname:5432/railway?sslmode=require`
   - It's long - make sure you copy ALL of it!

#### B. If You Don't Have PostgreSQL Service Yet:

1. **In Railway**, in your project, click **"New"** button (top right)
2. **Click "Database"** from the dropdown
3. **Click "Add PostgreSQL"**
4. **Wait for it to be created** (takes 1-2 minutes)
5. **Then follow Step 2A above** to get the DATABASE_URL

#### C. Add DATABASE_URL to Backend Service

1. **Go back to your backend service** (click on the TaskHive/backend card)

2. **Go to "Variables" tab**

3. **Click "+ New Variable"** or **"Add Variable"**

4. **Name:** `DATABASE_URL`
   - Type exactly: `DATABASE_URL` (case sensitive!)

5. **Value:** Paste the DATABASE_URL you copied from PostgreSQL service

6. **Click "Add"** or **"Save"**

---

### Step 3: Now Add Other Required Variables

While you're in the Variables tab, add these too:

1. **JWT_SECRET**
   - Name: `JWT_SECRET`
   - Value: Any random string (e.g., `my-super-secret-key-12345`)

2. **JWT_EXPIRES_IN**
   - Name: `JWT_EXPIRES_IN`
   - Value: `7d`

3. **NODE_ENV**
   - Name: `NODE_ENV`
   - Value: `production`

4. **FRONTEND_URL**
   - Name: `FRONTEND_URL`
   - Value: `http://localhost:5173` (we'll update this later)

---

### Step 4: Redeploy

1. **Go to "Deployments" tab**

2. **Click "Redeploy"** button (top right)

3. **Wait for deployment** (1-2 minutes)

4. **Check logs** - should see "Server running on port XXXX" without errors

---

### Step 5: Run Migrations (After Server Starts)

Once your server is running successfully:

1. **Go to "Deployments" tab**

2. **Click on the latest deployment** (should be "Active")

3. **Click "Deploy Logs"** tab

4. **Scroll down** and look for any database connection errors

5. **If everything looks good**, we can run migrations using Railway CLI or set up auto-migrations again

---

## Summary Checklist

- [ ] Changed Start Command to `npm run start` (in Settings)
- [ ] Created PostgreSQL database service (if needed)
- [ ] Copied DATABASE_URL from PostgreSQL service
- [ ] Added DATABASE_URL to backend service variables
- [ ] Added JWT_SECRET variable
- [ ] Added JWT_EXPIRES_IN variable
- [ ] Added NODE_ENV variable
- [ ] Added FRONTEND_URL variable
- [ ] Redeployed backend service
- [ ] Verified server starts successfully

---

## After Server Starts Successfully

Once you see "Server running on port XXXX" in the logs, your backend is working!

Then we can:
1. Run migrations (one-time setup)
2. Get your backend URL
3. Deploy frontend
4. Connect everything together

---

## Common Issues

### "DATABASE_URL still showing as undefined in logs"
- Make sure you added it in the **backend service** Variables, not PostgreSQL service
- Make sure the name is exactly `DATABASE_URL` (case sensitive)
- Try redeploying after adding the variable

### "Can't find PostgreSQL service"
- Click "New" → "Database" → "Add PostgreSQL"
- Wait for it to be created (shows "Provisioning" then "Active")

### "Server still not starting"
- Check all required variables are added
- Make sure Start Command is `npm run start` (not `start:migrate`)
- Check Deploy Logs for specific error messages

