# Frontend-Backend Connection Setup

## ✅ What's Been Done

1. **Installed Dependencies:**
   - `@tanstack/react-query` - For server state management
   - `axios` - For HTTP requests

2. **Created API Infrastructure:**
   - `src/config/api.ts` - Axios instance with auth interceptors
   - `src/services/auth.service.ts` - Authentication API service

3. **Updated AuthContext:**
   - Now uses backend API instead of localStorage
   - Handles token validation on app load
   - Proper error handling from API responses

4. **Added React Query:**
   - Wrapped app with QueryClientProvider
   - Ready for data fetching with caching

## 🚀 Testing the Connection

### Step 1: Start the Backend
```bash
cd backend
npm run dev
```
Backend should run on `http://localhost:5000`

### Step 2: Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend should run on `http://localhost:5173`

### Step 3: Test Registration
1. Go to `http://localhost:5173/register`
2. Fill in the form:
   - Name: Your name
   - Email: test@example.com
   - Password: password123 (min 6 chars)
3. Click "Sign Up"
4. Should redirect to dashboard on success

### Step 4: Test Login
1. Go to `http://localhost:5173/`
2. Enter the email and password you registered with
3. Click "Sign In"
4. Should redirect to dashboard on success

## 🔧 Configuration

The API URL is configured in `src/config/api.ts`:
- Default: `http://localhost:5000/api`
- Can be overridden with `VITE_API_URL` environment variable

To use a different backend URL, create a `.env` file in the frontend folder:
```
VITE_API_URL=http://your-backend-url/api
```

## 🐛 Troubleshooting

### "Network Error" or "Connection Refused"
- Make sure the backend server is running on port 5000
- Check that CORS is configured correctly in the backend
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

### "401 Unauthorized"
- Token might be expired or invalid
- Try logging out and logging back in
- Check browser console for detailed error messages

### "User with this email already exists"
- The email is already registered
- Try a different email or log in with existing credentials

## 📝 Next Steps

Now that authentication is connected, you can:
1. Build the Dashboard to show user's projects
2. Create project management features
3. Add Kanban board functionality
4. Implement real-time updates with Socket.IO









