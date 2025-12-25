import { Request, Response } from 'express';
import { mockHelpers, users } from '../models/mockData';

export const authController = {
  // POST /api/auth/login
  login: (req: Request, res: Response) => {
    const { provider, code, email, password } = req.body;

    let user;

    if (provider === 'email') {
      if (!email || !password) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'Email and password are required',
          details: [
            { field: 'email', message: 'Email is required' },
            { field: 'password', message: 'Password is required' }
          ]
        });
      }

      user = mockHelpers.getUserByCredentials(email, password);
    } else if (provider === 'google' || provider === 'github') {
      if (!code) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'OAuth code is required',
          details: [{ field: 'code', message: 'Code is required' }]
        });
      }

      user = mockHelpers.getUserByOAuth(provider, code);
    } else {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Invalid provider',
        details: [{ field: 'provider', message: 'Provider must be google, github, or email' }]
      });
    }

    if (!user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Invalid credentials'
      });
    }

    const accessToken = mockHelpers.createAccessToken(user.id);
    const refreshToken = mockHelpers.createRefreshToken(user.id);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });
  },

  // POST /api/auth/refresh
  refresh: (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Refresh token is required',
        details: [{ field: 'refreshToken', message: 'Refresh token is required' }]
      });
    }

    const user = mockHelpers.getUserByRefreshToken(refreshToken);

    if (!user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Invalid refresh token'
      });
    }

    const newAccessToken = mockHelpers.createAccessToken(user.id);
    const newRefreshToken = mockHelpers.createRefreshToken(user.id);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  },

  // POST /api/auth/logout
  logout: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    mockHelpers.revokeTokens(req.user.id);

    res.json({
      success: true
    });
  }
};
