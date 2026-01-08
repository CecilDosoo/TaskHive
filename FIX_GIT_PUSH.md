# Fix Git Push Error

The error `fatal: protocol '? [200~https' is not supported` happens when terminal escape sequences get pasted with the URL.

## Quick Fix

### Step 1: Remove the bad remote
```bash
git remote remove origin
```

### Step 2: Add the remote again (type manually or use quotes)
```bash
# Option A: Type the URL manually (recommended)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Option B: Use quotes to prevent escape sequences
git remote add origin "https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
```

### Step 3: Verify it's correct
```bash
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (push)
```

### Step 4: Push again
```bash
git push -u origin main
```

---

## Alternative: Set remote URL directly

If you already have origin set, just update it:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## Tips to Avoid This Issue

1. **Type the URL manually** instead of pasting
2. **Use quotes** around the URL when pasting
3. **Copy from GitHub** using the green "Code" button (not from address bar)
4. **Use SSH instead** (if you have SSH keys set up):
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

---

## If You Still Get Errors

1. Make sure you're using the correct repository URL from GitHub
2. Check you're logged into GitHub
3. You might need a Personal Access Token (see GITHUB_SETUP.md)

