# QUICK FIX - Update Database Username

## Simple Manual Fix (No Scripts Needed!)

### Step 1: Open the .env file
Navigate to: `backend\.env`

### Step 2: Find this line:
```
DATABASE_URL="postgresql://user:password@localhost:5432/taskhive?schema=public"
```

### Step 3: Replace it with your actual credentials:

**Format:**
```
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/taskhive?schema=public"
```

**Example (if your username is 'postgres'):**
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/taskhive?schema=public"
```

### Step 4: Save the file

### Step 5: Run migrations
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

---

## How to Find Your Username

**Option 1: Check pgAdmin**
- Open pgAdmin
- Right-click your PostgreSQL server → Properties → Connection tab
- See the username there

**Option 2: Try these common usernames:**
- `postgres` (most common)
- Your Windows username
- `admin`

**Option 3: Test connection**
```powershell
psql -U postgres
```
If it asks for password, `postgres` is correct!

---

## Common Issues

**"user" is wrong** → Change to `postgres` or your actual username

**Password has special characters** → Make sure it's properly quoted in the URL

**Database doesn't exist** → Create it first using pgAdmin or:
```sql
CREATE DATABASE taskhive;
```










