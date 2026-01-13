import { prisma } from '../utils/prisma';
import { verifyPassword, hashPassword } from '../utils/password';
import { User, AuthTokens, Provider } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Authentication Service
 *
 * Handles all authentication operations using Prisma database backend
 * - Email/password authentication with bcrypt hashing
 * - OAuth authentication (simplified for now)
 * - Token generation and management
 * - User registration
 */

// Token expiration times
const ACCESS_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Convert Prisma User to API User type
 */
const mapPrismaUserToUser = (prismaUser: any): User => {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    password: prismaUser.password || undefined,
    name: prismaUser.name,
    avatar: prismaUser.avatar,
    subscriptionTier: prismaUser.subscriptionTier as 'free' | 'pro',
    defaultRole: prismaUser.defaultRole || undefined,
    usageCount: typeof prismaUser.usageCount === 'string'
      ? JSON.parse(prismaUser.usageCount)
      : prismaUser.usageCount,
    limits: typeof prismaUser.limits === 'string'
      ? JSON.parse(prismaUser.limits)
      : prismaUser.limits,
    createdAt: prismaUser.createdAt.toISOString(),
    updatedAt: prismaUser.updatedAt.toISOString(),
  };
};

export const authService = {
  /**
   * Authenticate user with email and password
   * Verifies password using bcrypt and returns user if valid
   */
  authenticateWithEmail: async (email: string, password: string): Promise<User | null> => {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return null;
      }

      // Check if user has a password (email auth user)
      if (!user.password) {
        // User registered via OAuth, cannot authenticate with email/password
        return null;
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return mapPrismaUserToUser(user);
    } catch (error) {
      console.error('Error authenticating user with email:', error);
      return null;
    }
  },

  /**
   * Authenticate user with OAuth provider
   * Simplified implementation - returns first user for demo purposes
   * In production, this would verify the OAuth code with the provider
   */
  authenticateWithOAuth: async (provider: Provider, code: string): Promise<User | null> => {
    try {
      // In a real implementation, you would:
      // 1. Verify the OAuth code with the provider (Google, GitHub, etc.)
      // 2. Get user info from the provider
      // 3. Find or create user in database
      // 4. Return the user

      // For now, return the first user as a mock implementation
      const user = await prisma.user.findFirst();

      if (!user) {
        return null;
      }

      return mapPrismaUserToUser(user);
    } catch (error) {
      console.error('Error authenticating user with OAuth:', error);
      return null;
    }
  },

  /**
   * Generate access and refresh tokens for a user
   */
  generateTokens: async (userId: string): Promise<AuthTokens> => {
    try {
      // Generate unique tokens
      const accessToken = `access_${uuidv4()}`;
      const refreshToken = `refresh_${uuidv4()}`;

      const accessExpiresAt = new Date(Date.now() + ACCESS_TOKEN_EXPIRY);
      const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);

      // Store access token
      await prisma.access_tokens.create({
        data: {
          id: uuidv4(),
          token: accessToken,
          userId,
          expiresAt: accessExpiresAt,
        },
      });

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId,
          expiresAt: refreshExpiresAt,
        },
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Error generating tokens:', error);
      throw new Error('Failed to generate tokens');
    }
  },

  /**
   * Refresh access and refresh tokens using a valid refresh token
   */
  refreshTokens: async (refreshToken: string): Promise<{ user: User; tokens: AuthTokens } | null> => {
    try {
      // Find refresh token
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord) {
        return null;
      }

      // Check if token is expired
      if (tokenRecord.expiresAt < new Date()) {
        // Delete expired token
        await prisma.refreshToken.delete({
          where: { token: refreshToken },
        });
        return null;
      }

      // Delete old refresh token
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      // Generate new tokens
      const tokens = await authService.generateTokens(tokenRecord.userId);

      return {
        user: mapPrismaUserToUser(tokenRecord.user),
        tokens,
      };
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      return null;
    }
  },

  /**
   * Revoke all tokens for a user (logout)
   */
  revokeUserTokens: async (userId: string): Promise<void> => {
    try {
      // Delete all access tokens for user
      await prisma.access_tokens.deleteMany({
        where: { userId },
      });

      // Delete all refresh tokens for user
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    } catch (error) {
      console.error('Error revoking user tokens:', error);
      throw new Error('Failed to revoke tokens');
    }
  },

  /**
   * Register a new user with email and password
   */
  registerUser: async (
    email: string,
    password: string,
    name: string,
    avatar?: string
  ): Promise<User | null> => {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return null; // User already exists
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          avatar: avatar || 'https://i.pravatar.cc/150?img=1',
          subscriptionTier: 'free',
          usageCount: {
            analyses: 0,
            matches: 0,
            rewrites: 0,
          },
          limits: {
            maxAnalyses: 1,
            maxMatches: 0,
            maxRewrites: 0,
          },
        },
      });

      return mapPrismaUserToUser(user);
    } catch (error) {
      console.error('Error registering user:', error);
      return null;
    }
  },

  /**
   * Get user by access token
   */
  getUserByAccessToken: async (token: string): Promise<User | null> => {
    try {
      const accessToken = await prisma.access_tokens.findUnique({
        where: { token },
        include: { users: true },
      });

      if (!accessToken) {
        return null;
      }

      // Check if token is expired
      if (accessToken.expiresAt < new Date()) {
        // Delete expired token
        await prisma.access_tokens.delete({
          where: { token },
        });
        return null;
      }

      return mapPrismaUserToUser(accessToken.users);
    } catch (error) {
      console.error('Error getting user by access token:', error);
      return null;
    }
  },
};
