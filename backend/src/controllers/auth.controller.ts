import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { sendVerificationEmail, generateVerificationToken } from '../services/email.service';

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: { 
          message: 'Please check your input and try again.',
          errors: errors.array() 
        } 
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: { 
          message: 'An account with this email address already exists. Please sign in or use a different email.' 
        } 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // 24 hours expiry

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiry,
        emailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (emailError: any) {
      console.error(`[Auth] Failed to send verification email to ${user.email}:`, emailError.message);
      // Continue even if email fails - user can request resend
    }

    // Don't generate token - user must verify email before they can login
    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account before signing in.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: false,
      },
      emailVerified: false,
    });
  } catch (error: any) {
    console.error('[Auth] Registration error:', error.message);
    res.status(500).json({ 
      error: { 
        message: 'Unable to complete registration. Please try again later or contact support if the problem persists.' 
      } 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ 
        error: { 
          message: 'The email or password you entered is incorrect. Please check your credentials and try again.' 
        } 
      });
    }

    // Check if user has password (OAuth users might not have password)
    if (!user.password) {
      return res.status(401).json({ 
        error: { 
          message: 'This account was created using Google Sign-In. Please use the "Sign in with Google" option to continue.' 
        } 
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: { 
          message: 'The email or password you entered is incorrect. Please check your credentials and try again.' 
        } 
      });
    }

    // Check if email is verified - REQUIRED before login
    if (!user.emailVerified) {
      return res.status(403).json({ 
        error: { 
          message: 'Please verify your email address before signing in. We\'ve sent a verification link to your inbox. If you haven\'t received it, you can request a new one.',
          emailVerified: false,
          email: user.email,
        } 
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      token,
      emailVerified: user.emailVerified,
    });
  } catch (error: any) {
    console.error('[Auth] Login error:', error.message);
    res.status(500).json({ 
      error: { 
        message: 'Unable to sign in at this time. Please try again later or contact support if the problem persists.' 
      } 
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const userId = authReq.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ 
        error: { message: 'Your account could not be found. Please sign in again.' } 
      });
    }

    // Check if email is verified - REQUIRED for accessing the app
    if (!user.emailVerified) {
      return res.status(403).json({ 
        error: { 
          message: 'Please verify your email address before accessing the app. We\'ve sent a verification link to your inbox. If you haven\'t received it, you can request a new one.',
          emailVerified: false,
          email: user.email,
        } 
      });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch user' } });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: { message: 'Verification token is required' } });
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return res.status(400).json({ 
        error: { message: 'Invalid or expired verification token' } 
      });
    }

    // Update user as verified
    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    // Generate JWT token so user can be automatically logged in after verification
    const jwtToken = generateToken({
      userId: verifiedUser.id,
      email: verifiedUser.email,
      name: verifiedUser.name,
    });

    res.json({ 
      message: 'Email verified successfully. You can now sign in.',
      user: verifiedUser,
      token: jwtToken, // Return token so frontend can auto-login
      emailVerified: true,
    });
  } catch (error: any) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: { message: 'Failed to verify email' } });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: { message: 'Email is required' } });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ 
        message: 'If an account exists with this email, a verification link has been sent.' 
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({ 
        error: { message: 'Email is already verified' } 
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
      res.json({ 
        message: 'Verification email sent. Please check your inbox.' 
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({ 
        error: { message: 'Failed to send verification email. Please try again later.' } 
      });
    }
  } catch (error: any) {
    console.error('Resend verification email error:', error);
    res.status(500).json({ error: { message: 'Failed to resend verification email' } });
  }
};




