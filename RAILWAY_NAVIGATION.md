# How to Navigate Railway Dashboard

## Finding Your Backend Service After Deployment Failure

### Step 1: Access Your Project
1. Go to [railway.app](https://railway.app)
2. Sign in to your account
3. You should see your **"TaskHive"** project in the dashboard
4. Click on the **"TaskHive"** project card

### Step 2: View Your Services
Once inside the project, you'll see:
- A list of **services** (your backend, frontend, database, etc.)
- Each service appears as a card/panel

**Look for:**
- A service named **"TaskHive"** or **"taskhive"** (your backend)
- It might show "Build failed" or have a red indicator
- There might also be a **PostgreSQL** database service

### Step 3: Open Your Backend Service
1. **Click on the backend service card** (the one that failed)
   - It's usually the first service you created
   - It might be labeled with your GitHub repo name or "TaskHive"

2. This will open the service details page

### Step 4: Access Settings
Once inside the service, you'll see tabs at the top:
- **Deployments** (currently selected - shows the failed deployment)
- **Variables** (environment variables)
- **Metrics** (performance stats)
- **Settings** ← **CLICK THIS TAB**

### Step 5: Fix Root Directory
In the **Settings** tab:
1. Scroll down to find **"Root Directory"** or **"Build Settings"**
2. Look for a field labeled **"Root Directory"** or **"Working Directory"**
3. Change it from empty (or `.`) to: `backend`
4. Click **"Save"** or **"Update"**

### Step 6: Redeploy
After saving:
1. Go back to the **"Deployments"** tab
2. Click the **"Redeploy"** button (usually at the top right)
   - OR click the three dots (⋯) on the failed deployment → **"Redeploy"**

---

## Visual Guide

```
Railway Dashboard
├── TaskHive Project
    ├── TaskHive Service (Backend) ← Click here
    │   ├── Deployments Tab (shows failed build)
    │   ├── Variables Tab
    │   ├── Metrics Tab
    │   └── Settings Tab ← Go here to fix Root Directory
    └── PostgreSQL Database
```

---

## Alternative: If You Can't Find the Service

If you don't see a service card:

1. **Check if you're in the right project**
   - Look at the top left - should say "TaskHive"
   - If not, click the project name/icon to see all projects

2. **The service might be collapsed**
   - Look for expandable sections
   - Click to expand

3. **Create a new service**
   - Click **"New"** button (top right)
   - Select **"GitHub Repo"**
   - Choose your repository
   - **IMPORTANT**: Set **Root Directory** to `backend` immediately
   - Then configure other settings

---

## Quick Checklist

- [ ] Logged into Railway
- [ ] Opened "TaskHive" project
- [ ] Found the backend service (shows "Build failed")
- [ ] Clicked on the service
- [ ] Opened "Settings" tab
- [ ] Set "Root Directory" to `backend`
- [ ] Saved changes
- [ ] Redeployed

---

## Still Can't Find It?

1. **Take a screenshot** of your Railway dashboard
2. **Check the URL** - it should be something like:
   - `https://railway.app/project/YOUR_PROJECT_ID`
3. **Look for any red indicators** or "Build failed" messages
4. The service card should be visible on the main project page

---

## Need to Start Over?

If you want to delete and recreate the service:

1. Click on the failed service
2. Go to **Settings** tab
3. Scroll to the bottom
4. Click **"Delete Service"** (be careful!)
5. Then create a new service with correct settings from the start

