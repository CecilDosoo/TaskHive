# How to Run the App and View the Database

## 🚀 Running the Application

### Step 1: Start the Backend Server

Open a terminal and run:
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📡 Environment: development
🔗 Health check: http://localhost:5000/health
```

The backend API is now running at `http://localhost:5000`

### Step 2: Start the Frontend

Open a **new terminal** (keep backend running) and run:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

The frontend is now running at `http://localhost:5173`

---

## 📊 Viewing the Database

### Option 1: Prisma Studio (Easiest - Recommended)

Prisma Studio is a visual database browser built into Prisma.

**Steps:**
1. Make sure the backend is running (or at least the database is accessible)
2. Open a new terminal
3. Run:
   ```bash
   cd backend
   npm run prisma:studio
   ```

4. Your browser will automatically open to `http://localhost:5555`
5. You'll see all your database tables:
   - Users
   - Projects
   - ProjectMembers
   - Tasks
   - TaskLists
   - Comments
   - Attachments
   - Notifications

**Features:**
- Browse all tables
- View, edit, and delete records
- Add new records
- Filter and search
- See relationships between tables

### Option 2: pgAdmin (PostgreSQL GUI)

If you prefer pgAdmin:

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Expand: Servers → PostgreSQL → Databases → taskhive
4. Expand: Schemas → public → Tables
5. Right-click any table → "View/Edit Data" → "All Rows"

### Option 3: Command Line (psql)

```bash
# Connect to database
psql -U postgres -d taskhive

# List all tables
\dt

# View users table
SELECT * FROM users;

# View projects table
SELECT * FROM projects;

# View tasks table
SELECT * FROM tasks;

# Exit
\q
```

---

## 🧪 Testing the Database

### Test 1: Create a User via Frontend

1. Go to `http://localhost:5173/register`
2. Register a new user:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Sign Up"

**Check in Prisma Studio:**
- Open Prisma Studio: `npm run prisma:studio` (in backend folder)
- Click on "User" table
- You should see your newly created user!

### Test 2: Check Backend Logs

When you register/login, check the backend terminal. You should see:
- Database queries being executed
- Successful responses

### Test 3: Direct API Test

You can also test the API directly:

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test2@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📋 Quick Commands Reference

```bash
# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev

# View database (Prisma Studio)
cd backend
npm run prisma:studio

# Run migrations (if schema changes)
cd backend
npm run prisma:migrate

# Generate Prisma Client (if schema changes)
cd backend
npm run prisma:generate
```

---

## 🔍 What to Look For

After registering a user, you should see in the database:

**Users Table:**
- `id` - Unique user ID
- `email` - User's email
- `name` - User's name
- `password` - Hashed password (bcrypt)
- `createdAt` - Registration timestamp

**Projects Table:**
- Will be empty until you create projects

**Tasks Table:**
- Will be empty until you create tasks

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Make sure PostgreSQL service is running
- Check your `.env` file has correct DATABASE_URL
- Verify database `taskhive` exists

### "Prisma Studio won't open"
- Make sure backend `.env` file is configured
- Check that database connection works
- Try: `npx prisma studio` directly

### "Port 5555 already in use"
- Prisma Studio is already running
- Close the existing instance or use a different port:
  ```bash
  npx prisma studio --port 5556
  ```








