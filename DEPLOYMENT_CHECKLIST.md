# Deployment Checklist

Use this checklist before and after deploying TaskHive to production.

## Pre-Deployment

### Code Preparation
- [ ] All code is committed to Git
- [ ] Code is pushed to GitHub
- [ ] No console.log statements with sensitive data
- [ ] Error handling is in place
- [ ] Environment variables are documented

### Testing
- [ ] Tested locally (both frontend and backend work)
- [ ] Database migrations tested locally
- [ ] Email verification tested
- [ ] Google OAuth tested (if using)
- [ ] Real-time updates tested (Socket.IO)
- [ ] File uploads tested (if using)

### Security
- [ ] Generated strong `JWT_SECRET` (32+ characters)
- [ ] Generated strong `SESSION_SECRET` (32+ characters)
- [ ] `.env` files are in `.gitignore`
- [ ] No secrets in code
- [ ] CORS configured correctly

## Deployment Steps

### Railway Setup
- [ ] Created Railway account
- [ ] Connected GitHub repository
- [ ] Created PostgreSQL database
- [ ] Copied `DATABASE_URL` from database service
- [ ] Created backend service
- [ ] Set all backend environment variables
- [ ] Created frontend service
- [ ] Set `VITE_API_URL` in frontend service

### Backend Configuration
- [ ] `DATABASE_URL` set correctly
- [ ] `PORT` set (or using Railway's default)
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL` set to production frontend URL
- [ ] `JWT_SECRET` set (strong random string)
- [ ] `SESSION_SECRET` set (strong random string)
- [ ] SMTP credentials configured
- [ ] Google OAuth credentials configured (if using)
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install && npm run prisma:generate && npm run build`
- [ ] Start command: `npm run start`

### Frontend Configuration
- [ ] `VITE_API_URL` set to backend API URL
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Output directory: `dist`
- [ ] Custom domain configured (optional)

### Database Setup
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Prisma Client generated
- [ ] Database is accessible from backend

## Post-Deployment

### Backend Checks
- [ ] Backend service is running
- [ ] Backend URL is accessible
- [ ] Health check endpoint works (if exists)
- [ ] API endpoints respond correctly
- [ ] Database connections work
- [ ] Socket.IO connections work

### Frontend Checks
- [ ] Frontend service is running
- [ ] Frontend URL is accessible
- [ ] Frontend can connect to backend API
- [ ] No console errors in browser
- [ ] All assets load correctly

### Functionality Tests
- [ ] User registration works
- [ ] Email verification email sent and received
- [ ] Email verification link works
- [ ] User login works
- [ ] Google OAuth works (if configured)
- [ ] Create project works
- [ ] Create task works
- [ ] Edit task works
- [ ] Delete task works
- [ ] Task assignments work
- [ ] Member invitations work
- [ ] Notifications work
- [ ] Real-time updates work (test in 2 browsers)
- [ ] Activity logs display
- [ ] File uploads work (if using)

### Email Configuration
- [ ] Verification emails sending
- [ ] Notification emails sending (if configured)
- [ ] Email formatting looks correct
- [ ] Links in emails work

### Google OAuth (if using)
- [ ] OAuth redirect URIs updated in Google Console
- [ ] Authorized JavaScript origins updated
- [ ] Google login works
- [ ] Google signup creates account correctly

### Security Checks
- [ ] HTTPS enabled (automatic on Railway)
- [ ] Environment variables not exposed
- [ ] CORS configured correctly
- [ ] JWT tokens work correctly
- [ ] Authentication required for protected routes

### Performance Checks
- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] Images/assets optimized
- [ ] Database queries optimized

## Optional Enhancements

### Monitoring
- [ ] Error tracking set up (Sentry, LogRocket, etc.)
- [ ] Uptime monitoring configured
- [ ] Log aggregation set up
- [ ] Performance monitoring enabled

### Backups
- [ ] Database backups enabled
- [ ] Backup restoration tested
- [ ] Backup schedule configured

### Domain & SSL
- [ ] Custom domain configured
- [ ] SSL certificate active (automatic on Railway)
- [ ] Domain DNS configured correctly

## Troubleshooting

### If Backend Won't Start
1. Check Railway logs
2. Verify all environment variables are set
3. Check `DATABASE_URL` is correct
4. Verify migrations have run
5. Check build logs for errors

### If Frontend Won't Build
1. Check build logs
2. Verify `VITE_API_URL` is set
3. Check for TypeScript errors
4. Verify all dependencies installed

### If Database Connection Fails
1. Verify `DATABASE_URL` from database service
2. Check database is running
3. Run migrations: `npx prisma migrate deploy`
4. Test connection: `npx prisma studio` (if possible)

### If Emails Don't Send
1. Verify SMTP credentials
2. Use App Password for Gmail (not regular password)
3. Check email service logs
4. Test SMTP connection

### If OAuth Doesn't Work
1. Verify redirect URI in Google Console
2. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Ensure callback URL matches exactly
4. Check browser console for errors

---

## Quick Reference

### Generate Secrets
```bash
# Generate JWT_SECRET
openssl rand -hex 32

# Generate SESSION_SECRET
openssl rand -hex 32
```

### Run Migrations After Deployment
```bash
# In Railway terminal (backend service)
cd backend
npx prisma migrate deploy
```

### Test Locally First
```bash
# Backend
cd backend
npm install
npm run prisma:generate
npm run build
npm run start

# Frontend
cd frontend
npm install
npm run build
npm run preview
```

---

**After completing this checklist, your TaskHive app should be live and fully functional!** 🚀

