// In-memory mock data store
import {
  User,
  Resume,
  Analysis,
  JobDescription,
  Match,
  Rewrite,
  CareerGapAnalysis,
  LearningRoadmap
} from '../types';
import { verifyPassword } from '../utils/password';

// Mock Users Store
// Mock passwords (for testing):
// - john.doe@example.com: password123
// - jane.smith@example.com: propassword456
export const users: Map<string, User> = new Map([
  ['user-1', {
    id: 'user-1',
    email: 'john.doe@example.com',
    password: '$2b$12$/7JIEsyOsRmI8B2Cv/9L/.qZjeLf1Altie9nndJ45Yb2KmpwBwXbm', // password123 (bcrypt hashed)
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    subscriptionTier: 'free',
    defaultRole: 'Backend Engineer',
    usageCount: {
      analyses: 0,
      matches: 0,
      rewrites: 0
    },
    limits: {
      maxAnalyses: 1,
      maxMatches: 0,
      maxRewrites: 0
    },
    createdAt: '2024-01-01T00:00:00Z'
  }],
  ['user-2', {
    id: 'user-2',
    email: 'jane.smith@example.com',
    password: '$2b$12$q37a8M2VH/dg1Jp94gr45.SRhyrYeRw4HyZXrEYvFlxlQ6Xn8J.OW', // propassword456 (bcrypt hashed)
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    subscriptionTier: 'pro',
    defaultRole: 'Fullstack Developer',
    usageCount: {
      analyses: 5,
      matches: 3,
      rewrites: 2
    },
    limits: {
      maxAnalyses: 999999,
      maxMatches: 999999,
      maxRewrites: 999999
    },
    createdAt: '2024-01-01T00:00:00Z'
  }]
]);

// Mock Auth Tokens Store (refreshToken -> userId mapping)
export const refreshTokens: Map<string, string> = new Map([
  ['refresh-token-1', 'user-1'],
  ['refresh-token-2', 'user-2']
]);

// Mock Access Tokens Store (accessToken -> userId mapping)
export const accessTokens: Map<string, string> = new Map([
  ['access-token-1', 'user-1'],
  ['access-token-2', 'user-2']
]);

// Mock Resumes Store
export const resumes: Map<string, Resume> = new Map();

// Mock Analyses Store
export const analyses: Map<string, Analysis> = new Map();

// Mock Job Descriptions Store
export const jobDescriptions: Map<string, JobDescription> = new Map();

// Mock Matches Store
export const matches: Map<string, Match> = new Map();

// Mock Rewrites Store
export const rewrites: Map<string, Rewrite> = new Map();

// Mock Career Gap Analyses Store
export const careerGapAnalyses: Map<string, CareerGapAnalysis> = new Map();

// Mock Learning Roadmaps Store
export const learningRoadmaps: Map<string, LearningRoadmap> = new Map();

// Helper functions to manage mock data
export const mockHelpers = {
  // Get user by email and password (with bcrypt verification)
  getUserByCredentials: async (email: string, password: string): Promise<User | undefined> => {
    for (const user of users.values()) {
      if (user.email === email) {
        // Verify password if user has one stored (email auth)
        if (user.password) {
          const isPasswordValid = await verifyPassword(password, user.password);
          if (isPasswordValid) {
            return user;
          }
          // Password doesn't match - return undefined
          return undefined;
        }
        // No password stored (OAuth user) - should not authenticate with email/password
        return undefined;
      }
    }
    return undefined;
  },

  // Get user by OAuth provider (simplified)
  getUserByOAuth: (provider: string, code: string): User | undefined => {
    // In mock, return first user for any OAuth attempt
    return users.get('user-1');
  },

  // Create new access token
  createAccessToken: (userId: string): string => {
    const token = `access-token-${Date.now()}-${Math.random()}`;
    accessTokens.set(token, userId);
    return token;
  },

  // Create new refresh token
  createRefreshToken: (userId: string): string => {
    const token = `refresh-token-${Date.now()}-${Math.random()}`;
    refreshTokens.set(token, userId);
    return token;
  },

  // Get user by access token
  getUserByAccessToken: (token: string): User | undefined => {
    const userId = accessTokens.get(token);
    return userId ? users.get(userId) : undefined;
  },

  // Get user by refresh token
  getUserByRefreshToken: (token: string): User | undefined => {
    const userId = refreshTokens.get(token);
    return userId ? users.get(userId) : undefined;
  },

  // Revoke tokens
  revokeTokens: (userId: string): void => {
    // Remove all tokens for user
    for (const [token, id] of accessTokens.entries()) {
      if (id === userId) {
        accessTokens.delete(token);
      }
    }
    for (const [token, id] of refreshTokens.entries()) {
      if (id === userId) {
        refreshTokens.delete(token);
      }
    }
  },

  // Get resumes by user
  getResumesByUser: (userId: string): Resume[] => {
    const userResumes: Resume[] = [];
    for (const resume of resumes.values()) {
      if (resume.userId === userId) {
        userResumes.push(resume);
      }
    }
    return userResumes.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Get analyses by resume
  getAnalysesByResume: (resumeId: string): Analysis[] => {
    const resumeAnalyses: Analysis[] = [];
    for (const analysis of analyses.values()) {
      if (analysis.resumeId === resumeId) {
        resumeAnalyses.push(analysis);
      }
    }
    return resumeAnalyses.sort((a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  },

  // Get matches by resume
  getMatchesByResume: (resumeId: string): Match[] => {
    const resumeMatches: Match[] = [];
    for (const match of matches.values()) {
      if (match.resumeId === resumeId) {
        resumeMatches.push(match);
      }
    }
    return resumeMatches.sort((a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  },

  // Get rewrites by resume
  getRewritesByResume: (resumeId: string): Rewrite[] => {
    const resumeRewrites: Rewrite[] = [];
    for (const rewrite of rewrites.values()) {
      if (rewrite.resumeId === resumeId) {
        resumeRewrites.push(rewrite);
      }
    }
    return resumeRewrites.sort((a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  },

  // Check if user owns resume
  userOwnsResume: (userId: string, resumeId: string): boolean => {
    const resume = resumes.get(resumeId);
    return resume?.userId === userId;
  },

  // Increment usage count
  incrementUsage: (userId: string, type: 'analyses' | 'matches' | 'rewrites'): void => {
    const user = users.get(userId);
    if (user) {
      user.usageCount[type]++;
    }
  },

  // Check if user can perform action
  canPerformAction: (userId: string, type: 'analyses' | 'matches' | 'rewrites'): boolean => {
    const user = users.get(userId);
    if (!user) return false;

    if (user.subscriptionTier === 'pro') return true;

    return user.usageCount[type] < user.limits[`max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof user.limits];
  }
};
