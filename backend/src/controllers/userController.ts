import { Request, Response } from 'express';
import { users } from '../models/mockData';
import { Role } from '../types';

export const userController = {
  // GET /api/users/me
  getMe: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const user = users.get(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'not_found',
        message: 'User not found'
      });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      subscriptionTier: user.subscriptionTier,
      usageCount: user.usageCount,
      limits: user.limits,
      createdAt: user.createdAt
    });
  },

  // PATCH /api/users/me
  updateMe: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const user = users.get(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'not_found',
        message: 'User not found'
      });
    }

    const { name, defaultRole } = req.body;

    // Validate defaultRole if provided
    if (defaultRole) {
      const validRoles: Role[] = [
        'Backend Engineer',
        'Frontend Engineer',
        'Fullstack Developer',
        'Mobile Developer',
        'Tech Lead'
      ];

      if (!validRoles.includes(defaultRole)) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid role value',
          details: [
            {
              field: 'defaultRole',
              message: 'Invalid role value'
            }
          ]
        });
      }
    }

    // Update user
    if (name) user.name = name;
    if (defaultRole) user.defaultRole = defaultRole;
    user.updatedAt = new Date().toISOString();

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      defaultRole: user.defaultRole,
      updatedAt: user.updatedAt
    });
  }
};
