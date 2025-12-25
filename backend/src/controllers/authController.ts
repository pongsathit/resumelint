import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { sendUnauthorized, sendValidationError } from '../utils/errors';
import { validateProvider } from '../utils/validators';
import { ERROR_MESSAGES } from '../constants/errors';
import { Provider } from '../types';

export const authController = {
  login: (req: Request, res: Response) => {
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

      user = authService.authenticateWithEmail(email, password);
    } else {
      if (!code) {
        return sendValidationError(res, 'OAuth code is required', [
          { field: 'code', message: 'Code is required' },
        ]);
      }

      user = authService.authenticateWithOAuth(provider as Provider, code);
    }

    if (!user) {
      return sendUnauthorized(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const tokens = authService.generateTokens(user.id);

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

  refresh: (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendValidationError(res, 'Refresh token is required', [
        { field: 'refreshToken', message: 'Refresh token is required' },
      ]);
    }

    const result = authService.refreshTokens(refreshToken);

    if (!result) {
      return sendUnauthorized(res, 'Invalid refresh token');
    }

    res.json({
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });
  },

  logout: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    authService.revokeUserTokens(req.user.id);

    res.json({
      success: true,
    });
  },
};
