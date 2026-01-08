# Push to GitHub with Personal Access Token

## Method 1: Use Token When Prompted (Easiest)

When you run `git push -u origin main`, Git will ask for credentials:

1. **Username**: Enter your GitHub username
2. **Password**: Paste your Personal Access Token (NOT your GitHub password)

```bash
git push -u origin main
```

When prompted:
```
Username for 'https://github.com': YOUR_USERNAME
Password for 'https://YOUR_USERNAME@github.com': YOUR_TOKEN_HERE
```

---

## Method 2: Include Token in Remote URL (One-time setup)

Update your remote URL to include the token:

```bash
# Replace YOUR_USERNAME, YOUR_TOKEN, and YOUR_REPO_NAME
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Then push normally:
```bash
git push -u origin main
```

**⚠️ Security Note**: This stores the token in your `.git/config` file. Anyone with access to your computer can see it.

---

## Method 3: Use Git Credential Helper (Recommended for Security)

Store your credentials securely:

### Windows (Git Credential Manager):
```bash
# Configure Git to use Windows Credential Manager
git config --global credential.helper manager-core

# Then push (it will prompt once and save)
git push -u origin main
# Enter: Username = YOUR_USERNAME, Password = YOUR_TOKEN
```

### Store credentials permanently:
```bash
# This will save your credentials
git config --global credential.helper store

# Then push (it will prompt once and save to ~/.git-credentials)
git push -u origin main
```

---

## Method 4: Use SSH Instead (Most Secure)

If you prefer SSH (no token needed after initial setup):

1. **Generate SSH key** (if you don't have one):
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Press Enter twice for no passphrase (or set one)
```

2. **Copy your public key**:
```bash
cat ~/.ssh/id_ed25519.pub
# Copy the entire output
```

3. **Add to GitHub**:
   - Go to GitHub → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste your public key
   - Save

4. **Change remote to SSH**:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

5. **Push**:
```bash
git push -u origin main
```

---

## Quick Reference

### Check your current remote:
```bash
git remote -v
```

### Update remote URL with token:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Update remote URL to SSH:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

---

## Troubleshooting

### "Authentication failed"
- Make sure you're using the **token**, not your GitHub password
- Check the token has `repo` scope
- Token might be expired (generate a new one)

### "Permission denied"
- Verify the repository name is correct
- Check you have write access to the repo
- Token might not have the right permissions

### "Repository not found"
- Check the repository URL is correct
- Make sure the repo exists on GitHub
- Verify your token has access to the repo

---

## Security Best Practices

1. **Don't commit tokens to Git** - They're in `.gitignore` for a reason!
2. **Use SSH** for long-term projects (most secure)
3. **Use credential helper** to avoid typing token repeatedly
4. **Rotate tokens** if you suspect they're compromised
5. **Use fine-grained tokens** with minimal permissions needed

---

## Example: Complete Push with Token

```bash
# 1. Check current remote
git remote -v

# 2. Update remote with token (one-time)
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 3. Push
git push -u origin main

# Or use credential helper (prompts once, saves for future)
git config --global credential.helper manager-core
git push -u origin main
# Enter username and token when prompted
```

