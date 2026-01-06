import { AuthRepository } from '../repositories';
import { User, AuthTokens, Provider } from '../types';

export const authService = {
  authenticateWithEmail: async (email: string, password: string): Promise<User | null> => {
    return await AuthRepository.getUserByCredentials(email, password);
  },

  authenticateWithOAuth: async (provider: Provider, code: string): Promise<User | null> => {
    return await AuthRepository.getUserByOAuth(provider, code);
  },

  generateTokens: async (userId: string): Promise<AuthTokens> => {
    // Generate unique tokens
    const accessToken = `access-token-${Date.now()}-${Math.random()}`;
    const refreshToken = `refresh-token-${Date.now()}-${Math.random()}`;

    // Store in database
    await AuthRepository.createAccessToken(userId, accessToken);
    await AuthRepository.createRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  },

  refreshTokens: async (refreshToken: string): Promise<{ user: User; tokens: AuthTokens } | null> => {
    const user = await AuthRepository.getUserByRefreshToken(refreshToken);
    if (!user) {
      return null;
    }

    // Generate new tokens
    const accessToken = `access-token-${Date.now()}-${Math.random()}`;
    const newRefreshToken = `refresh-token-${Date.now()}-${Math.random()}`;

    await AuthRepository.createAccessToken(user.id, accessToken);
    await AuthRepository.createRefreshToken(user.id, newRefreshToken);

    return {
      user,
      tokens: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    };
  },

  revokeUserTokens: async (userId: string): Promise<void> => {
    await AuthRepository.revokeUserTokens(userId);
  },
};
