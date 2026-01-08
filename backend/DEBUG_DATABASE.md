# Debugging: User Not Showing in Database

## Quick Checks

### 1. Check Backend Logs
When you register, check the backend terminal. You should see:
- Database queries being logged
- Any error messages

Look for lines like:
```
Register error: [error details]
```

### 2. Verify Database Connection
Make sure Prisma Studio is connected to the same database as your backend.

**Check your `.env` file:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskhive?schema=public"
```

Make sure:
- Database name is `taskhive` (or whatever you created)
- Username and password match
- Host is `localhost`
- Port is `5432`

### 3. Refresh Prisma Studio
- Close Prisma Studio
- Reopen it: `npm run prisma:studio`
- Click on the "User" table
- Click the refresh button (or press F5)

### 4. Check if User Actually Exists
Run this in your backend terminal or psql:

```bash
# Using psql
psql -U postgres -d taskhive
SELECT * FROM users;
```

### 5. Check for Errors
Look at the browser's Network tab:
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try registering again
4. Click on the `/api/auth/register` request
5. Check the Response tab for any errors

### 6. Verify Registration is Working
Check the response in browser console:
- Should return: `{ message: 'User registered successfully', user: {...}, token: '...' }`
- If you see an error, that's the issue








