# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project (or select existing)**
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it "TaskHive" (or any name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "People API"
   - Click on it and click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" (unless you have a Google Workspace)
     - Fill in:
       - App name: `TaskHive`
       - User support email: Your email
       - Developer contact: Your email
     - Click "Save and Continue"
     - Scopes: Click "Add or Remove Scopes"
       - Select: `.../auth/userinfo.email` and `.../auth/userinfo.profile`
     - Click "Save and Continue"
     - Test users: Add your email (for testing)
     - Click "Save and Continue"
     - Click "Back to Dashboard"

5. **Create OAuth Client ID**
   - Application type: "Web application"
   - Name: "TaskHive Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5001` (for development)
     - `http://localhost:5173` (frontend, if needed)
   - Authorized redirect URIs:
     - `http://localhost:5001/api/auth/google/callback`
   - Click "Create"

6. **Copy Your Credentials**
   - You'll see a popup with:
     - **Client ID** (starts with something like `123456789-abc...`)
     - **Client Secret** (starts with `GOCSPX-...`)
   - **Copy both** - you'll need them in the next step

## Step 2: Add Credentials to Backend .env

Open `backend/.env` and add:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
```

**Important:** 
- Replace `your-client-id-here` with your actual Client ID
- Replace `your-client-secret-here` with your actual Client Secret
- The callback URL must match exactly what you entered in Google Cloud Console

## Step 3: Restart Backend Server

1. Stop your backend server (Ctrl+C)
2. Start it again: `npm run dev`
3. You should see: `✅ Google OAuth configured` (or no warning)

## Step 4: Test Google OAuth

1. Go to your frontend: `http://localhost:5173`
2. Click "Sign in with Google" or "Sign up with Google"
3. You'll be redirected to Google
4. Sign in with your Google account
5. Allow permissions
6. You'll be redirected back and logged in!

## Troubleshooting

### "OAuth client not found"
- Check that your Client ID is correct in `.env`
- Make sure there are no extra spaces

### "Redirect URI mismatch"
- The callback URL in `.env` must match exactly what's in Google Cloud Console
- Check: `http://localhost:5001/api/auth/google/callback` (no trailing slash)

### "Access blocked: This app's request is invalid"
- Make sure you added your email as a test user in OAuth consent screen
- Or publish the app (for production)

### "Google OAuth is not configured"
- Check that both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in `.env`
- Restart the backend server

## For Production

When deploying:

1. **Update Google Cloud Console:**
   - Add production URLs to "Authorized JavaScript origins"
   - Add production callback URL: `https://yourdomain.com/api/auth/google/callback`

2. **Update .env:**
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Publish OAuth App:**
   - In Google Cloud Console, go to "OAuth consent screen"
   - Click "Publish App" (if not already published)




