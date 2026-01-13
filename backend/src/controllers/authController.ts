import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { sendUnauthorized, sendValidationError } from '../utils/errors';
import { validateProvider } from '../utils/validators';
import { ERROR_MESSAGES } from '../constants/errors';
import { Provider } from '../types';

export const authController = {
  login: async (req: Request, res: Response) => {
    const { provider, code, email, password } = req.body;

    const providerValidation = validateProvider(provider);
    if (!providerValidation.isValid) {
      return sendValidationError(res, 'Invalid provider', providerValidation.details);
    }

    let user;

    if (provider === 'email') {
      if (!email || !password) {
        return sendValidationError(res, 'Email and password are required', [
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password is required' },
        ]);
      }

      user = await authService.authenticateWithEmail(email, password);
    } else {
      if (!code) {
        return sendValidationError(res, 'OAuth code is required', [
          { field: 'code', message: 'Code is required' },
        ]);
      }

      user = await authService.authenticateWithOAuth(provider as Provider, code);
    }

    if (!user) {
      return sendUnauthorized(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const tokens = await authService.generateTokens(user.id);

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  },

  register: async (req: Request, res: Response) => {
    const { email, password, name, avatar } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return sendValidationError(res, 'Email, password, and name are required', [
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password is required' },
        { field: 'name', message: 'Name is required' },
      ]);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendValidationError(res, 'Invalid email format', [
        { field: 'email', message: 'Invalid email format' },
      ]);
    }

    // Validate password length
    if (password.length < 8) {
      return sendValidationError(res, 'Password must be at least 8 characters long', [
        { field: 'password', message: 'Password must be at least 8 characters long' },
      ]);
    }

    // Register user
    const user = await authService.registerUser(email, password, name, avatar);

    if (!user) {
      return res.status(409).json({
        error: 'conflict',
        message: 'User with this email already exists',
      });
    }

    // Generate tokens for the new user
    const tokens = await authService.generateTokens(user.id);

    res.status(201).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  },

  refresh: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendValidationError(res, 'Refresh token is required', [
        { field: 'refreshToken', message: 'Refresh token is required' },
      ]);
    }

    const result = await authService.refreshTokens(refreshToken);

    if (!result) {
      return sendUnauthorized(res, 'Invalid refresh token');
    }

    res.json({
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });
  },

  logout: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    await authService.revokeUserTokens(req.user.id);

    res.json({
      success: true,
    });
  },
};
