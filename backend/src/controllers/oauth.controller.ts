import { Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt.util';

// Configure Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('✅ Google OAuth configured');
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with this Google ID
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Check if user exists with this email (but no Google ID)
        user = await prisma.user.findUnique({
          where: { email: profile.emails?.[0]?.value || '' },
        });

        if (user) {
          // Link Google account to existing user
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId: profile.id,
              emailVerified: true, // Google emails are verified
              avatar: profile.photos?.[0]?.value || user.avatar,
            },
          });
          return done(null, user);
        }

        // Create new user
        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName || profile.name?.givenName || 'User',
            avatar: profile.photos?.[0]?.value || null,
            emailVerified: true, // Google emails are verified
            password: null, // OAuth users don't have passwords
          },
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
  );
} else {
  console.warn('⚠️  Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable.');
  console.warn('   See GOOGLE_OAUTH_SETUP.md for instructions.');
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export const googleAuth = (req: Request, res: Response, next: any) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ Google OAuth not configured - missing credentials');
    return res.status(503).json({ error: 'Google OAuth is not configured' });
  }
  console.log('🔐 Initiating Google OAuth flow...');
  return passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
};

export const googleCallback = [
  (req: Request, res: Response, next: any) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(503).json({ error: 'Google OAuth is not configured' });
    }
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return passport.authenticate('google', { 
      failureRedirect: `${frontendUrl}/login?error=oauth_failed`,
      session: false 
    })(req, res, next);
  },
  async (req: Request, res: Response) => {
    try {
      console.log('✅ Google OAuth callback received');
      // This will be called after Google authentication
      const user = (req as any).user;

      if (!user) {
        console.error('❌ No user found in OAuth callback');
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`
        );
      }

      console.log('✅ User authenticated via Google:', { id: user.id, email: user.email });

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
      });

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      console.log('🔐 Redirecting to frontend with token');
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&emailVerified=${user.emailVerified}`);
    } catch (error: any) {
      console.error('❌ Google OAuth callback error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`
      );
    }
  },
];

