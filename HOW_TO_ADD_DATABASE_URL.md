# How to Add DATABASE_URL - Step by Step

This guide will show you exactly where to click to add the DATABASE_URL.

---

## Part 1: Create PostgreSQL Database (If You Don't Have One)

### Step 1: Check if You Have PostgreSQL

1. **Look at your Railway dashboard**
2. **Do you see TWO cards/services?**
   - One for your backend (TaskHive/backend)
   - One for PostgreSQL database
   
**If you only see ONE card** (just your backend), you need to create PostgreSQL first.

### Step 2: Create PostgreSQL Database

1. **In Railway**, look at the top of your project page
2. **Click the "New" button** (usually a big "+" or "New" button, top right corner)
3. **A menu will appear** - look for options like:
   - "Database"
   - "PostgreSQL"
   - "Add Service"
4. **Click "Database"** or **"PostgreSQL"** from that menu
5. **Click "Add PostgreSQL"** or just **"PostgreSQL"**
6. **Wait 1-2 minutes** - Railway will create the database
7. **You'll see a NEW card appear** - this is your PostgreSQL database

---

## Part 2: Get the DATABASE_URL from PostgreSQL

### Step 3: Open PostgreSQL Service

1. **Find the PostgreSQL card** in your Railway project
   - It might be labeled "PostgreSQL" or have a database icon
   - It's a separate card from your backend

2. **Click on that PostgreSQL card** (click anywhere on it)

3. **You'll see the PostgreSQL service page**

### Step 4: Find DATABASE_URL

1. **Look at the TABS at the top** of the PostgreSQL service page
   - You'll see tabs like: "Overview", "Variables", "Metrics", "Settings"

2. **Click the "Variables" tab**

3. **You'll see a list of variables** - look for one named:
   - `DATABASE_URL` (all caps, with underscore)

4. **The value will be a long string** that looks like:
   ```
   postgresql://postgres:abc123xyz@containers-us-west-123.railway.app:5432/railway?sslmode=require
   ```
   (Your actual URL will be different - it's unique to your database)

5. **Copy this entire value:**
   - **Option A:** Click the **copy icon** (looks like two overlapping squares) next to the value
   - **Option B:** Click on the value itself to select it, then right-click → Copy
   - **Option C:** Click "Reveal" or "Show" to see the full value, then copy it

6. **Make sure you copied the ENTIRE thing** - it's usually very long!

---

## Part 3: Add DATABASE_URL to Your Backend Service

### Step 5: Go Back to Backend Service

1. **Click your browser's back button** OR
2. **Click on your project name** at the top to go back to project view
3. **Click on your BACKEND service card** (the TaskHive/backend one, NOT PostgreSQL)

### Step 6: Open Variables Tab

1. **You're now on your backend service page**
2. **Look at the TABS at the top:**
   - "Deployments", "Variables", "Metrics", "Settings"
3. **Click the "Variables" tab**

### Step 7: Add DATABASE_URL Variable

1. **Look for a button that says:**
   - "+ New Variable"
   - "Add Variable"
   - "New"
   - Or a "+" icon

2. **Click that button**

3. **Two fields will appear:**
   - **Left field:** Variable Name (or "Key")
   - **Right field:** Variable Value (or "Value")

4. **In the LEFT field (Name/Key):**
   - Type exactly: `DATABASE_URL`
   - Must be all caps
   - Must have underscore, not a space or dash
   - Be careful with spelling!

5. **In the RIGHT field (Value):**
   - **Paste** the DATABASE_URL you copied from PostgreSQL
   - Right-click and paste, or Ctrl+V
   - Make sure you got the whole thing!

6. **Click "Add"** or **"Save"** button

7. **You should now see `DATABASE_URL` in your variables list!**

---

## Visual Guide - What You're Looking For

### In PostgreSQL Service:
```
[PostgreSQL Card]
  └─ Click it
      └─ Variables Tab
          └─ Find: DATABASE_URL
              └─ Copy the long value
```

### In Backend Service:
```
[Backend Card]
  └─ Click it
      └─ Variables Tab
          └─ Click "+ New Variable"
              └─ Name: DATABASE_URL
              └─ Value: (paste from PostgreSQL)
                  └─ Click "Add"
```

---

## Troubleshooting

### "I don't see a PostgreSQL card"
- You need to create it first (see Part 1)
- Click "New" → "Database" → "Add PostgreSQL"

### "I don't see DATABASE_URL in PostgreSQL Variables"
- Wait a minute - it takes time to appear
- Refresh the page
- Make sure you're looking at the PostgreSQL service, not backend

### "I don't see 'Variables' tab"
- Make sure you clicked on the service card first
- The tabs appear AFTER you click into a service
- Try refreshing the page

### "I copied DATABASE_URL but where do I paste it?"
- Go to your BACKEND service (not PostgreSQL)
- Variables tab
- Click "+ New Variable"
- Paste in the "Value" field (right side)

### "The value is hidden/shows dots"
- Look for a "Reveal", "Show", or eye icon
- Click it to see the full value
- Then copy it

---

## Quick Checklist

- [ ] Created PostgreSQL database (if needed)
- [ ] Opened PostgreSQL service
- [ ] Went to Variables tab
- [ ] Found DATABASE_URL
- [ ] Copied the entire DATABASE_URL value
- [ ] Went back to backend service
- [ ] Opened backend Variables tab
- [ ] Clicked "+ New Variable"
- [ ] Typed `DATABASE_URL` in Name field
- [ ] Pasted DATABASE_URL in Value field
- [ ] Clicked "Add" or "Save"
- [ ] Verified DATABASE_URL appears in the list

---

## Still Confused?

Tell me:
1. **How many cards/services do you see** in Railway? (Just 1, or 2+?)
2. **What tabs do you see** when you click on a service?
3. **What exact step are you stuck on?**

I'll help you get through it! 😊

