# After Linking Railway - Next Steps

## ✅ You've Successfully Linked!

Once you select "TaskHive" (the backend service), you'll see a success message.

## Next: Set Environment Variables

**In the same PowerShell window, run these commands:**

### 1. Get DATABASE_URL from Railway Web

**First, get your DATABASE_URL:**
1. Go to Railway web → Your project → **PostgreSQL** service → **Variables** tab
2. Find `DATABASE_URL` 
3. **Copy the entire value** (it looks like: `postgresql://postgres:password@host:port/dbname`)

### 2. Set DATABASE_URL via CLI

**In PowerShell, run (replace with your actual DATABASE_URL):**

```bash
railway variables set DATABASE_URL="postgresql://postgres:yourpassword@postgres.railway.internal:5432/railway"
```

### 3. Set Other Required Variables

```bash
railway variables set JWT_SECRET="my-super-secret-jwt-key-change-this-12345-abcdef-xyz-789"
railway variables set JWT_EXPIRES_IN="7d"
railway variables set NODE_ENV="production"
railway variables set FRONTEND_URL="http://localhost:5173"
```

**If you have email/SMTP configured, also set:**

```bash
railway variables set SMTP_USER="your-email@gmail.com"
railway variables set SMTP_PASS="your-app-password"
railway variables set SMTP_FROM="TaskHive <your-email@gmail.com>"
```

**If you have Google OAuth configured, also set:**

```bash
railway variables set GOOGLE_CLIENT_ID="your-client-id"
railway variables set GOOGLE_CLIENT_SECRET="your-client-secret"
railway variables set GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"
```

### 4. Verify Variables Are Set

```bash
railway variables
```

**You should see all your variables listed!**

### 5. Redeploy

**After setting variables, redeploy:**

```bash
railway up
```

**OR redeploy via Railway web:**
- Railway → Deployments → Click "Redeploy"

### 6. Check Logs

**After redeploy, check if DATABASE_URL is recognized:**

```bash
railway logs
```

**You should see in the logs:**
```
✅ DATABASE_URL is available!
```

**NOT:**
```
❌ DATABASE_URL is still not set!
```

---

## Quick Command Summary

```bash
# 1. Link (you already did this - just select "TaskHive" service)
railway link

# 2. Set variables (get DATABASE_URL from Railway web first!)
railway variables set DATABASE_URL="your-database-url-here"
railway variables set JWT_SECRET="your-secret-here"
railway variables set JWT_EXPIRES_IN="7d"
railway variables set NODE_ENV="production"

# 3. Verify
railway variables

# 4. Redeploy
railway up

# 5. Check logs
railway logs
```

---

## Troubleshooting

### "Service already linked"
- That's fine! You can skip to setting variables

### "Variable already exists"
- That's fine! It will update the existing variable

### "Permission denied"
- Make sure you're logged into the right Railway account
- Check Railway web to verify you're the project owner

