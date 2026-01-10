# How to Install Railway CLI

## Step 1: Open a Terminal

**Choose one of these:**

### Option A: PowerShell (Easiest on Windows)
1. **Press Windows key** (or click Start)
2. **Type:** `powershell`
3. **Click "Windows PowerShell"** or **"PowerShell"**
4. **A blue/black window opens** - this is your terminal

### Option B: Command Prompt
1. **Press Windows key**
2. **Type:** `cmd`
3. **Click "Command Prompt"**
4. **A black window opens**

### Option C: Git Bash (If you have it)
1. **Search "Git Bash"** in Start menu
2. **Open Git Bash**
3. **A terminal window opens**

---

## Step 2: Install Railway CLI

**In the terminal window, type this command and press Enter:**

```bash
npm install -g @railway/cli
```

**What this does:**
- `npm` = Node Package Manager (comes with Node.js)
- `install` = install a package
- `-g` = install globally (available everywhere)
- `@railway/cli` = Railway command-line tool

**Wait for it to finish** (takes 10-30 seconds)

**You should see:**
```
+ @railway/cli@x.x.x
added X packages in Xs
```

---

## Step 3: Verify Installation

**Type this to check if it worked:**

```bash
railway --version
```

**You should see:** `@railway/cli/x.x.x` (version number)

**If you see "command not found":**
- Node.js might not be installed
- Or npm is not in your PATH
- Try: `npx @railway/cli --version` instead

---

## Step 4: Continue with Railway Setup

**Once installed, stay in the same terminal and run:**

```bash
# Login to Railway
railway login

# This will open your browser to authorize
```

---

## Troubleshooting

### "npm is not recognized"
- **Node.js is not installed**
- Download from: https://nodejs.org/
- Install it, then try again

### "Permission denied" or "Access denied"
- **Run terminal as Administrator:**
  1. Right-click PowerShell/Command Prompt
  2. Click "Run as Administrator"
  3. Try the install command again

### Installation takes forever
- **This is normal** - npm downloads packages
- Wait for it to finish
- Don't close the terminal

---

## After Installation

Once Railway CLI is installed, you can use it from **any terminal window** - you don't need to install it again.

**Next steps:**
1. `railway login` - Login to Railway
2. `railway link` - Link to your project
3. `railway variables set DATABASE_URL="..."` - Set variables

---

## Quick Reference

**Where to run commands:**
- ✅ PowerShell (Windows built-in)
- ✅ Command Prompt (Windows built-in)
- ✅ Git Bash (if installed)
- ❌ NOT in VS Code terminal (unless it's one of the above)

**Just open any terminal and run the command!**

