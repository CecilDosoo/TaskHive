# How to Create the PostgreSQL Database

Choose one of these methods:

## Method 1: Using PowerShell Script (Easiest)

Run the helper script:

```powershell
cd backend
.\create-database.ps1
```

The script will prompt you for your PostgreSQL credentials and create the database automatically.

## Method 2: Using pgAdmin (GUI - Recommended for Beginners)

1. **Open pgAdmin** (usually installed with PostgreSQL)

2. **Connect to your PostgreSQL server:**
   - Enter your PostgreSQL password when prompted
   - If you see a lock icon, right-click and select "Connect Server"

3. **Create the database:**
   - Right-click on **"Databases"** in the left sidebar
   - Select **"Create"** → **"Database..."**
   - In the **"Database"** field, enter: `taskhive`
   - Click **"Save"**

Done! The database is created.

## Method 3: Using psql Command Line

### Step 1: Open PowerShell

### Step 2: Connect to PostgreSQL

If `psql` is in your PATH:
```powershell
psql -U postgres
```

If not, use the full path:
```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
```
*(Replace `16` with your PostgreSQL version)*

### Step 3: Enter your password when prompted

### Step 4: Create the database

```sql
CREATE DATABASE taskhive;
```

### Step 5: Verify it was created

```sql
\l
```

You should see `taskhive` in the list.

### Step 6: Exit psql

```sql
\q
```

## Method 4: One-Line Command

If you know your password, you can create it in one command:

```powershell
$env:PGPASSWORD="your_password"; psql -U postgres -c "CREATE DATABASE taskhive;"
```

Or with full path:
```powershell
$env:PGPASSWORD="your_password"; & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE taskhive;"
```

## Finding Your PostgreSQL Installation

If you can't find `psql`, it's usually located at:
- `C:\Program Files\PostgreSQL\[VERSION]\bin\psql.exe`

Common versions: 12, 13, 14, 15, 16

## After Creating the Database

1. **Update your `.env` file** with the correct `DATABASE_URL`:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskhive?schema=public"
   ```

2. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

3. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

## Troubleshooting

### "psql: command not found"
- Add PostgreSQL bin folder to your PATH, OR
- Use the full path to psql.exe, OR
- Use pgAdmin (Method 2) instead

### "Authentication failed"
- Double-check your PostgreSQL password
- Make sure PostgreSQL service is running

### "Database already exists"
- That's fine! The database is already created. You can proceed to the next steps.










