# How to Commit and Push Changes

## Where to Run Commands

**Run these commands from the ROOT directory** (`taskhive2`), NOT from the backend folder.

## Step-by-Step Instructions

### 1. Open Git Bash

- Search for "Git Bash" in Windows Start menu
- Open it

### 2. Navigate to Your Project

```bash
cd /c/Users/junio/OneDrive/Desktop/taskhive2
```

(Replace with your actual path if different)

### 3. Check What Changed

```bash
git status
```

You should see files like:
- `backend/package.json`
- `backend/railway.json`
- `railway.json`
- `SIMPLE_DEPLOYMENT_GUIDE.md`

### 4. Add All Changes

```bash
git add .
```

This adds all the changed files.

### 5. Commit the Changes

```bash
git commit -m "Auto-run migrations on startup"
```

### 6. Push to GitHub

```bash
git push origin main
```

### 7. Wait for Railway

- Railway will automatically detect the push
- It will start a new deployment
- Check Railway dashboard → Deployments to see it deploying

## That's It!

After pushing, Railway will automatically:
1. Pull the new code
2. Build it
3. Deploy it
4. Run migrations automatically
5. Start your server

## Verify It Worked

1. Go to Railway → Your backend service
2. Click "Deployments" tab
3. Watch the new deployment
4. Click on it to see logs
5. Look for: "All migrations have been applied"

---

## Troubleshooting

### "git is not recognized"
- Make sure you're using **Git Bash**, not PowerShell or Command Prompt
- Or add Git to your PATH (see GITHUB_SETUP.md)

### "Not a git repository"
- Make sure you're in the `taskhive2` folder (root directory)
- Run `pwd` to check your current directory

### "Nothing to commit"
- Run `git status` to see what files changed
- Make sure you saved all files in your editor

