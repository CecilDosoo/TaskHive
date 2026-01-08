# PostgreSQL Setup Guide

## Step 1: Create the Database

You can create the database using one of these methods:

### Option A: Using psql (Command Line)

1. Open PowerShell or Command Prompt
2. Connect to PostgreSQL (you may need to add PostgreSQL to your PATH):
```bash
psql -U postgres
```

3. Enter your PostgreSQL password when prompted
4. Create the database:
```sql
CREATE DATABASE taskhive;
```

5. Exit psql:
```sql
\q
```

### Option B: Using pgAdmin (GUI)

1. Open pgAdmin
2. Right-click on "Databases" → "Create" → "Database"
3. Name it: `taskhive`
4. Click "Save"

### Option C: Using SQL Command Directly

```bash
psql -U postgres -c "CREATE DATABASE taskhive;"
```

## Step 2: Configure Environment Variables

1. Create a `.env` file in the `backend` folder
2. Copy the template below and update with your PostgreSQL credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
# Default PostgreSQL setup:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskhive?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173

# AWS S3 (for file uploads - configure later)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=taskhive-uploads
```

**Important:** Replace:
- `YOUR_PASSWORD` with your PostgreSQL password
- `postgres` with your PostgreSQL username if different
- `localhost:5432` if your PostgreSQL is on a different host/port

## Step 3: Install Dependencies and Set Up Database

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

## Step 4: Verify Setup

Run the development server:
```bash
npm run dev
```

You should see: `🚀 Server running on port 5000`

## Troubleshooting

### Connection Error?
- Make sure PostgreSQL service is running
- Check your username/password in DATABASE_URL
- Verify the database `taskhive` exists
- Check if PostgreSQL is listening on port 5432

### Can't find psql command?
- Add PostgreSQL bin folder to your PATH
- Default location: `C:\Program Files\PostgreSQL\[version]\bin`











