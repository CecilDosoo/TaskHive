# Email Setup Guide - Real Email Delivery

This guide will help you configure TaskHive to send real verification emails to users' inboxes.

## Option 1: Gmail (Recommended for Development)

Gmail is the easiest option for development and testing. You'll need to create an "App Password" to use with SMTP.

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under "Signing in to Google", find **2-Step Verification**
4. Click it and follow the prompts to enable it (if not already enabled)

### Step 2: Generate an App Password

1. Still in **Security** settings, find **App passwords** (you may need to search for it)
2. Click **App passwords**
3. Select **Mail** as the app
4. Select **Other (Custom name)** as the device
5. Type "TaskHive" as the name
6. Click **Generate**
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Add to .env File

Add these lines to your `backend/.env` file:

```env
# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=TaskHive <your-email@gmail.com>
```

**Important:**
- `SMTP_USER` should be your Gmail address (e.g., `john@gmail.com`)
- `SMTP_PASS` should be the 16-character app password (remove spaces: `abcdefghijklmnop`)
- `SMTP_FROM` is what appears as the sender name/email

### Step 4: Test It

1. Restart your backend server
2. Register a new account
3. Check the email inbox for the verification email!

---

## Option 2: Other Email Providers

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=TaskHive <noreply@yourdomain.com>
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your-mailgun-password
SMTP_FROM=TaskHive <noreply@yourdomain.com>
```

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=TaskHive <your-email@outlook.com>
```

### Custom SMTP Server

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
SMTP_FROM=TaskHive <noreply@yourdomain.com>
```

**For SSL/TLS (port 465):**
```env
SMTP_PORT=465
SMTP_SECURE=true
```

---

## Troubleshooting

### "SMTP authentication failed" Error

- **Gmail**: Make sure you're using an App Password, not your regular password
- **Other providers**: Double-check your username and password
- Verify 2-Step Verification is enabled (for Gmail)

### "Could not connect to SMTP server" Error

- Check your `SMTP_HOST` and `SMTP_PORT` settings
- Make sure your firewall isn't blocking the connection
- Try port 465 with `SMTP_SECURE=true` if port 587 doesn't work

### Emails Going to Spam

- Make sure `SMTP_FROM` uses a valid email address
- For production, set up SPF, DKIM, and DMARC records for your domain
- Consider using a dedicated email service like SendGrid or Mailgun for production

### Gmail "Less secure app" Error

- Gmail no longer supports "less secure apps"
- You **must** use an App Password (see Step 2 above)
- Regular passwords will not work

---

## Production Recommendations

For production, consider:

1. **SendGrid** - Reliable, good free tier (100 emails/day)
2. **Mailgun** - Developer-friendly, good free tier
3. **AWS SES** - Very cheap, requires AWS setup
4. **Postmark** - Great deliverability, paid service

All of these services provide SMTP credentials that work with the same configuration above.


