# Set Variables Using Railway CLI - Step by Step

You're logged in and in the right directory! Now let's link and set variables.

## Step 1: Link Railway to Your Project

**In the same PowerShell window, run:**

```bash
railway link
```

**This will:**
1. Show you a list of your Railway projects
2. Ask: "Which project?"
3. **Select "TaskHive"** (type the number or name)
4. Ask: "Which service?"
5. **Select your backend service** (the one with your code, not PostgreSQL)

**Example output:**
```
? Select project: › TaskHive
? Select service: › taskhive-backend (or similar name)
```

---

## Step 2: Set Environment Variables

**After linking, set each variable one by one:**

### Set DATABASE_URL (Most Important!)

**Get the value from Railway web:**
1. Go to Railway → PostgreSQL service → Variables tab
2. Copy the entire DATABASE_URL value
3. Then in PowerShell, run:

```bash
railway variables set DATABASE_URL="postgresql://postgres:cWiKqyczCaVuZUjWcigNMrkKZhFYFKO@postgres.railway.internal:5432/railway"
```

**(Replace with your actual DATABASE_URL from Railway)**

### Set JWT_SECRET

```bash
railway variables set JWT_SECRET="my-super-secret-jwt-key-change-this-in-production-12345-abcdef"
```

(Use any random string - make it long and random)

### Set Other Variables

```bash
railway variables set JWT_EXPIRES_IN="7d"
railway variables set NODE_ENV="production"
railway variables set FRONTEND_URL="http://localhost:5173"
```

---

## Step 3: Verify Variables Are Set

**Check what variables you have:**

```bash
railway variables
```

**You should see:**
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN
- NODE_ENV
- FRONTEND_URL
- etc.

---

## Step 4: Redeploy

**After setting variables, redeploy:**

```bash
railway up
```

**OR redeploy via web:**
- Railway → Deployments → Redeploy

---

## Step 5: Check Logs

**After redeploy, check logs:**

```bash
railway logs
```

**Or check in Railway web:**
- Deployments → Latest deployment → Deploy Logs

**You should now see:**
```
✅ DATABASE_URL is set: postgresql://postgres:cWiKqyczCaVuZ...
✅ JWT_SECRET: SET ✅
```

---

## Quick Commands Summary

```bash
# Link to project (do this first)
railway link

# Set variables
railway variables set DATABASE_URL="your-database-url-here"
railway variables set JWT_SECRET="your-secret-here"
railway variables set JWT_EXPIRES_IN="7d"
railway variables set NODE_ENV="production"

# Check variables
railway variables

# Redeploy
railway up

# Check logs
railway logs
```

---

## Troubleshooting

### "No projects found"
- Make sure you're logged in: `railway login`
- Check you're using the right Railway account

### "Variable not set"
- Make sure you ran `railway link` first
- Make sure you selected the BACKEND service (not PostgreSQL)

### "Permission denied"
- Make sure you're the owner/admin of the Railway project
- Check Railway web to verify your account has access

