# GitHub Setup Guide

This guide will help you push your TaskHive code to GitHub.

## Step 1: Verify Git Installation

1. Open **Git Bash** (search for "Git Bash" in Windows Start menu)
   - OR open **Command Prompt** (not PowerShell)
   - OR add Git to your PATH

2. Test if git works:
```bash
git --version
```

If it says "git is not recognized", you need to:
- **Option A**: Use Git Bash instead of PowerShell
- **Option B**: Add Git to your PATH (see below)

### Adding Git to PATH (if needed)

1. Find where Git is installed (usually `C:\Program Files\Git\cmd`)
2. Add it to Windows PATH:
   - Search "Environment Variables" in Windows
   - Click "Environment Variables"
   - Under "System variables", find "Path" → Edit
   - Add: `C:\Program Files\Git\cmd`
   - Click OK and restart your terminal

---

## Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `taskhive` (or any name you like)
   - **Description**: "TaskHive - Team Task Management Application"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize with README" (we already have code)
4. Click **"Create repository"**
5. **Copy the repository URL** (looks like: `https://github.com/yourusername/taskhive.git`)

---

## Step 3: Initialize Git in Your Project

Open **Git Bash** or **Command Prompt** in your project folder:

```bash
# Navigate to your project folder
cd C:\Users\junio\OneDrive\Desktop\taskhive2

# Initialize git (if not already done)
git init

# Check status
git status
```

---

## Step 4: Create .gitignore (if not exists)

Make sure you have a `.gitignore` file in the root. Create it if needed:

**Root `.gitignore`**:
```
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
*.tsbuildinfo

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Uploads
uploads/
```

---

## Step 5: Add and Commit Your Code

```bash
# Add all files
git add .

# Check what will be committed
git status

# Commit with a message
git commit -m "Initial commit - TaskHive application ready for deployment"

# If this is your first time using git, set your name and email:
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 6: Connect to GitHub and Push

```bash
# Add your GitHub repository as remote
# Replace YOUR_USERNAME and REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Verify remote is added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: If you get authentication errors, you may need to:
- Use a **Personal Access Token** instead of password
- Or use **GitHub Desktop** (easier GUI option)

---

## Step 7: Using Personal Access Token (if needed)

If GitHub asks for authentication:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "TaskHive Deployment"
4. Select scopes: Check **"repo"** (full control)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. When pushing, use the token as your password

---

## Alternative: Using GitHub Desktop (Easier!)

If command line is difficult, use **GitHub Desktop**:

1. Download: [desktop.github.com](https://desktop.github.com)
2. Install and sign in with GitHub
3. Click "File" → "Add Local Repository"
4. Browse to: `C:\Users\junio\OneDrive\Desktop\taskhive2`
5. Click "Publish repository" (top right)
6. Choose name and click "Publish repository"
7. Done! Your code is on GitHub.

---

## Troubleshooting

### "git is not recognized"
- Use **Git Bash** instead of PowerShell/CMD
- Or add Git to PATH (see Step 1)

### "Authentication failed"
- Use Personal Access Token (see Step 7)
- Or use GitHub Desktop

### "Repository not found"
- Check the repository URL is correct
- Make sure you created the repo on GitHub first

### "Permission denied"
- Make sure you're logged into GitHub
- Check repository name matches exactly

---

## After Pushing to GitHub

Once your code is on GitHub, you can:
1. Deploy to Railway (see `DEPLOYMENT_QUICKSTART.md`)
2. Share your code with others
3. Track changes with version control
4. Set up CI/CD pipelines

---

## Quick Commands Reference

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View commit history
git log

# Create new branch
git checkout -b feature-name
```

---

**Need help?** If you get stuck, let me know what error message you see!

