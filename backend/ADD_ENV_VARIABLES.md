# Add These to Your Backend .env File

Add these new environment variables to your existing `backend/.env` file:

## Required for Email & OAuth

```env
# Email Configuration (REQUIRED - for real email delivery)
# See EMAIL_SETUP.md for detailed setup instructions
# For Gmail: Use an App Password (not your regular password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-or-smtp-password
SMTP_FROM=TaskHive <your-email@gmail.com>

# Google OAuth (get from Google Cloud Console)
# Setup guide: GOOGLE_OAUTH_SETUP.md
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Session Secret (for OAuth sessions)
SESSION_SECRET=your-random-secret-key-min-32-chars-change-in-production
```

## Quick Setup Steps

### 1. Email Setup (REQUIRED - ~5 minutes)
**See `EMAIL_SETUP.md` for complete instructions.**

**Quick Gmail Setup:**
1. Enable 2-Step Verification on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password
4. Add to `.env`:
   - `SMTP_USER=your-email@gmail.com`
   - `SMTP_PASS=your-16-char-app-password`

### 2. Google OAuth Setup (5 minutes)
**See `GOOGLE_OAUTH_SETUP.md` for complete instructions.**

Quick steps:
1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable "Google+ API" in APIs & Services → Library
4. Go to APIs & Services → Credentials
5. Click "Create Credentials" → "OAuth client ID"
6. Choose "Web application"
7. Add Authorized redirect URI: `http://localhost:5001/api/auth/google/callback`
8. Copy Client ID and Client Secret to `.env`

### 3. Session Secret
Just generate a random string (at least 32 characters). You can use:
- Online generator: https://randomkeygen.com/
- Or just type random characters

## After Adding Variables

1. Restart your backend server
2. Test email verification by registering a new account
3. Check your email inbox for the verification link!
4. Test Google OAuth by clicking "Sign in with Google"

## Important Notes

- **Email**: Now sends REAL emails to users' inboxes (no more Ethereal Email)
- **Gmail**: You MUST use an App Password, not your regular password
- **Other Providers**: See `EMAIL_SETUP.md` for SendGrid, Mailgun, Outlook, etc.
- **Production**: Consider using SendGrid or Mailgun for better deliverability





