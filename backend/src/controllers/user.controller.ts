import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';

/**
 * Search users by email
 */
export const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.query;
    const userId = req.userId!;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: { message: 'Email query parameter is required' } });
    }

    // Search for users by email (partial match)
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: email,
          mode: 'insensitive',
        },
        // Don't return the current user
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
      take: 10, // Limit to 10 results
    });

    res.json({ users });
  } catch (error: any) {
    console.error('Search users error:', error);
    res.status(500).json({ error: { message: 'Failed to search users' } });
  }
};






