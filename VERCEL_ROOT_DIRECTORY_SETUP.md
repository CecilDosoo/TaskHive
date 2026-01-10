# How to Set Root Directory in Vercel - Visual Guide

## 🎯 Quick Answer

**When you import your GitHub repo in Vercel, you need to tell it where your frontend code is located.**

Since your repo structure is:
```
taskhive2/
├── backend/
└── frontend/    ← This is where your frontend code is!
```

You need to set **Root Directory** to `frontend`.

---

## 📸 Step-by-Step with What You'll See

### Step 1: After Importing Your Repo

After you click **"Import"** on your GitHub repo, you'll see a page that looks like:

```
┌─────────────────────────────────────────┐
│ Configure Project                        │
├─────────────────────────────────────────┤
│ Project Name: taskhive2                 │
│                                         │
│ Root Directory: .          [Edit] ←─ Click here! │
│                                         │
│ Framework Preset: [Auto-detect]        │
│ Build Command: npm run build           │
│ Output Directory: dist                 │
│ ...                                     │
└─────────────────────────────────────────┘
```

### Step 2: Click "Edit" on Root Directory

**Click the "Edit" button** next to "Root Directory"

You'll see either:
- **Option A:** A text input field appears
- **Option B:** A dropdown/select menu appears
- **Option C:** A folder browser opens

### Step 3: Set to "frontend"

#### If you see a **text input field:**
1. Clear the field (it might say `.` or `./`)
2. Type: `frontend`
3. Press Enter or click outside the field

#### If you see a **dropdown/select menu:**
1. Click the dropdown
2. Look for `frontend` in the list
3. Select `frontend`

#### If you see a **folder browser:**
1. Click on `frontend` folder
2. Select it
3. Click "OK" or "Select"

### Step 4: Verify It Changed

**After setting it, you should see:**

```
Root Directory: frontend    (current: ./frontend)
```

**NOT:**
```
Root Directory: .           (current: ./)        ❌ Wrong!
Root Directory: ./frontend  (current: ./frontend) ⚠️ Might work, but `frontend` is cleaner
```

---

## 🔍 Where to Find Root Directory in Vercel

### Location 1: During Initial Import (First Time)

1. **Vercel Dashboard** → **"+ Add New..."** → **"Project"**
2. Select your GitHub repo (`taskhive2`)
3. Click **"Import"**
4. **Configure Project** page appears
5. Look for **"Root Directory"** section (usually near the top)
6. Click **"Edit"** or the field itself

### Location 2: In Project Settings (If Already Deployed)

1. **Vercel Dashboard** → **Your Project** (`taskhive2`)
2. Click **"Settings"** tab (top navigation)
3. Click **"General"** in the left sidebar
4. Scroll down to **"Root Directory"** section
5. Click **"Edit"** to change it

---

## ✅ What It Should Look Like After

**Correct Configuration:**
```
Project Name: taskhive2
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

---

## 🐛 Troubleshooting

### "I don't see Root Directory option"

**Solution:**
- You might be on an older Vercel interface
- Try refreshing the page
- Or set it after deployment in Settings → General → Root Directory

### "I can't type in the field"

**Solution:**
- Make sure you clicked "Edit" first
- Try clicking directly on the field value
- Some interfaces require you to click a folder icon first

### "It says 'No files found' after setting to frontend"

**Solution:**
- Make sure you typed `frontend` (not `Frontend` or `FRONTEND` - case sensitive!)
- Check that `frontend` folder exists in your repo
- Try typing `./frontend` instead
- Verify your GitHub repo structure is correct

### "Build fails after setting Root Directory"

**Solution:**
- Make sure `frontend/package.json` exists
- Check that build command is `npm run build`
- Verify output directory is `dist`
- Check build logs in Vercel for specific errors

---

## 💡 Pro Tips

### Tip 1: Check Before Deploying

**Before clicking "Deploy", verify:**
- ✅ Root Directory: `frontend`
- ✅ Framework: `Vite`
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`

### Tip 2: Test Build Locally First

**To make sure everything works:**

```bash
cd frontend
npm install
npm run build
```

**If this works locally, Vercel should work too!**

### Tip 3: After First Deploy

**If you forgot to set Root Directory and the build failed:**
1. Go to **Project Settings** → **General**
2. Find **"Root Directory"**
3. Change it to `frontend`
4. Click **"Save"**
5. Go to **Deployments** → Click **"Redeploy"**

---

## 🎯 Quick Checklist

- [ ] Imported GitHub repo in Vercel
- [ ] Found "Root Directory" field
- [ ] Set Root Directory to `frontend`
- [ ] Verified it says `frontend` (not `.`)
- [ ] Framework auto-detected as "Vite"
- [ ] Build Command is `npm run build`
- [ ] Output Directory is `dist`
- [ ] Ready to deploy!

---

## 📝 Alternative: Using vercel.json (Already Done!)

**Good news:** You already have `frontend/vercel.json` configured!

**However,** setting Root Directory in Vercel dashboard is still important because:
- Vercel needs to know where to run the build from
- The vercel.json file must be in the root directory you specify

**So both matter:**
1. ✅ Set Root Directory to `frontend` in Vercel
2. ✅ `vercel.json` is already in `frontend/` folder (done!)

---

## 🚀 Once Root Directory is Set

**After setting Root Directory to `frontend`, continue with:**

1. ✅ Verify all settings look correct
2. ✅ Add environment variable `VITE_API_URL`
3. ✅ Click **"Deploy"**
4. ✅ Wait for build to complete
5. ✅ Get your frontend URL!

---

**Still having trouble?** Let me know what you see in the Vercel interface and I'll help you navigate it! 🎯

