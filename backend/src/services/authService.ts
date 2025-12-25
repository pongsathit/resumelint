import { mockHelpers } from '../models/mockData';
import { User, AuthTokens, Provider } from '../types';

export const authService = {
  authenticateWithEmail: (email: string, password: string): User | null => {
    return mockHelpers.getUserByCredentials(email, password) || null;
  },

  authenticateWithOAuth: (provider: Provider, code: string): User | null => {
    return mockHelpers.getUserByOAuth(provider, code) || null;
  },

  generateTokens: (userId: string): AuthTokens => {
    return {
      accessToken: mockHelpers.createAccessToken(userId),
      refreshToken: mockHelpers.createRefreshToken(userId),
    };
  },

  refreshTokens: (refreshToken: string): { user: User; tokens: AuthTokens } | null => {
    const user = mockHelpers.getUserByRefreshToken(refreshToken);
    if (!user) {
      return null;
    }

    const tokens = {
      accessToken: mockHelpers.createAccessToken(user.id),
      refreshToken: mockHelpers.createRefreshToken(user.id),
    };

    return { user, tokens };
  },

  revokeUserTokens: (userId: string): void => {
    mockHelpers.revokeTokens(userId);
  },
};
