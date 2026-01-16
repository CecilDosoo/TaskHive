# Restore Prisma Database - Quick Fix Guide

## Problem
- Prisma crashed
- No data or tables showing
- Database connection issues

## Solution Steps

### Step 1: Stop Backend Server
**IMPORTANT:** The backend server must be stopped before running Prisma commands.

1. Find the terminal where your backend is running
2. Press `Ctrl+C` to stop it
3. Wait a few seconds for it to fully stop

### Step 2: Check PostgreSQL is Running

Open PowerShell and run:
```powershell
Get-Service -Name postgresql*
```

If it shows "Stopped", start it:
```powershell
Start-Service -Name postgresql-x64-XX  # Replace XX with your version
```

### Step 3: Navigate to Backend Directory

```powershell
cd C:\Users\junio\OneDrive\Desktop\taskhive2\backend
```

### Step 4: Generate Prisma Client

```powershell
npx prisma generate
```

### Step 5: Apply Migrations (Restore Tables)

**Option A: If you want to keep existing data (if any)**
```powershell
npx prisma migrate deploy
```

**Option B: If you want to reset everything (DELETES ALL DATA)**
```powershell
npx prisma migrate reset --force
```

**Option C: If migrations are out of sync**
```powershell
npx prisma migrate dev
```

### Step 6: Verify Database Connection

```powershell
npx prisma db pull
```

This should show your tables. If it works, you're good!

### Step 7: Restart Backend Server

```powershell
npm run dev
```

## Quick Fix Script

I've created a script that does all of this automatically:

```powershell
cd backend
.\fix-database.ps1
```

**But remember:** Stop your backend server first!

## Common Issues

### "Can't reach database server"
- PostgreSQL is not running
- Start it: `Start-Service -Name postgresql-x64-XX`

### "EPERM: operation not permitted"
- Backend server is still running
- Stop it with `Ctrl+C` and try again

### "Database does not exist"
- Check your `.env` file has the correct `DATABASE_URL`
- Format: `postgresql://username:password@localhost:5432/database_name?schema=public`

### "Migration failed"
- Try: `npx prisma migrate reset --force` (WARNING: Deletes all data)
- Or: `npx prisma migrate dev` to create a new migration

## After Fixing

1. ✅ Tables should be restored
2. ✅ You may need to create a new account (if database was reset)
3. ✅ All features should work normally




