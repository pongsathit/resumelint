import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { sendUnauthorized, sendNotFound, sendValidationError } from '../utils/errors';
import { validateRole } from '../utils/validators';
import { ERROR_MESSAGES } from '../constants/errors';

export const userController = {
  getMe: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const user = userService.getUserById(req.user.id);

    if (!user) {
      return sendNotFound(res, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      subscriptionTier: user.subscriptionTier,
      usageCount: user.usageCount,
      limits: user.limits,
      createdAt: user.createdAt,
    });
  },

  updateMe: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { name, defaultRole } = req.body;

    if (defaultRole) {
      const roleValidation = validateRole(defaultRole);
      if (!roleValidation.isValid) {
        return sendValidationError(res, 'Invalid role value', roleValidation.details);
      }
    }

    const user = userService.updateUser(req.user.id, { name, defaultRole });

    if (!user) {
      return sendNotFound(res, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      defaultRole: user.defaultRole,
      updatedAt: user.updatedAt,
    });
  },
};
