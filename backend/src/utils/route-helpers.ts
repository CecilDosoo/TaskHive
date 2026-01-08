import { Request, Response, RequestHandler } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Type-safe wrapper for route handlers that use AuthRequest
 */
export function asAuthHandler(
  handler: (req: AuthRequest, res: Response) => Promise<Response | void> | Response | void
): RequestHandler {
  return (req: Request, res: Response) => {
    return handler(req as AuthRequest, res);
  };
}

