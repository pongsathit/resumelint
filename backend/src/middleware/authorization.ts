import { Request, Response, NextFunction } from 'express';
import { sendForbidden } from '../utils/errors';
import { ERROR_MESSAGES } from '../constants/errors';

export const requireProTier = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendForbidden(res, ERROR_MESSAGES.AUTH_REQUIRED);
  }

  if (req.user.subscriptionTier !== 'pro') {
    return sendForbidden(res, ERROR_MESSAGES.PRO_REQUIRED);
  }

  next();
};
