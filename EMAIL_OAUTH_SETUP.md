# Email Verification & Google OAuth Setup Guide

## ✅ What's Been Implemented

### Backend
1. **Email Verification System**
   - Users must verify their email after registration
   - Verification tokens expire after 24 hours
   - Resend verification email endpoint

2. **Google OAuth Integration**
   - Sign in/sign up with Google
   - Automatic account linking for existing emails
   - Google users are automatically verified

3. **Email Notifications**
   - Email notifications sent for:
     - Task assignments
     - Project invitations
     - Task comments
     - Status changes
   - Only sent to verified email addresses

### Frontend
1. **Email Verification UI**
   - Verification page (`/verify-email`)
   - Resend verification page (`/resend-verification`)
   - Email verification status shown in user profile

2. **Google OAuth UI**
   - "Sign in with Google" button on login
   - "Sign up with Google" button on register
   - OAuth callback handler

## 🔧 Environment Variables Setup

### Backend (.env)

```env
# Email Configuration
# For Development (using Ethereal Email - fake SMTP for testing)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-email@ethereal.email
SMTP_PASS=your-ethereal-password
SMTP_FROM=noreply@taskhive.com

# For Production (use real SMTP service)
# Option 1: Gmail (requires App Password)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# SMTP_FROM=noreply@taskhive.com

# Option 2: SendGrid
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASS=your-sendgrid-api-key
# SMTP_FROM=noreply@taskhive.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
# For production: https://yourdomain.com/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
# For production: https://yourdomain.com

# Session Secret (for OAuth sessions)
SESSION_SECRET=your-random-secret-key-change-in-production

# Node Environment
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5001/api
# For production: https://yourdomain.com/api
```

## 📧 Setting Up Email (Development)

### Option 1: Ethereal Email (Recommended for Testing)
1. Go to https://ethereal.email/
2. Click "Create Account"
3. Copy the SMTP credentials to your `.env` file
4. Emails won't actually be sent, but you'll get preview URLs in console

### Option 2: Gmail SMTP
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use your Gmail address and the app password in `.env`

### Option 3: Mailtrap (Testing)
1. Sign up at https://mailtrap.io/
2. Get SMTP credentials from your inbox
3. Use those credentials in `.env`

## 🔐 Setting Up Google OAuth

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name it "TaskHive" (or your choice)

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add Authorized JavaScript origins:
     - `http://localhost:5001` (development)
     - `https://yourdomain.com` (production)
   - Add Authorized redirect URIs:
     - `http://localhost:5001/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)

5. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your backend `.env` file

## 🗄️ Database Migration

After updating the Prisma schema, run:

```bash
cd backend
npx prisma migrate dev --name add_email_verification_oauth
npx prisma generate
```

## 🚀 Testing

### Test Email Verification
1. Register a new account
2. Check your email (or Ethereal preview URL in console)
3. Click the verification link
4. You should be redirected to dashboard with success message

### Test Google OAuth
1. Click "Sign in with Google" on login page
2. Select your Google account
3. You should be redirected back and logged in

### Test Email Notifications
1. Assign a task to a user with verified email
2. Check their email for notification
3. Email should include action button to view task

## 📝 Notes

- **Development**: Use Ethereal Email or Mailtrap - no real emails sent
- **Production**: Configure real SMTP service (SendGrid, Mailgun, AWS SES, etc.)
- **Google OAuth**: Works locally, just add production redirect URIs when deploying
- **Email Verification**: Users can still login without verification, but will see a banner
- **OAuth Users**: Automatically verified (Google emails are pre-verified)

## 🐛 Troubleshooting

### Email not sending?
- Check SMTP credentials in `.env`
- For Ethereal, check console for preview URL
- Verify `NODE_ENV` is set correctly

### Google OAuth not working?
- Verify redirect URI matches exactly in Google Console
- Check `GOOGLE_CALLBACK_URL` in `.env`
- Ensure Google+ API is enabled

### Verification link expired?
- Tokens expire after 24 hours
- Use "Resend Verification" page to get a new link

## 🎉 Next Steps

1. Set up environment variables
2. Run database migration
3. Test email verification
4. Test Google OAuth
5. Configure production email service when deploying





