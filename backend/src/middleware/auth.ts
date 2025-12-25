import { Request, Response, NextFunction } from 'express';
import { mockHelpers } from '../models/mockData';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        subscriptionTier: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Authentication required'
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const user = mockHelpers.getUserByAccessToken(token);

  if (!user) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Invalid or expired token'
    });
  }

  // Attach user to request
  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    subscriptionTier: user.subscriptionTier
  };

  next();
};

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = mockHelpers.getUserByAccessToken(token);

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier
      };
    }
  }

  next();
};
