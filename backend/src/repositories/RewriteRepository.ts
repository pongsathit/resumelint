import prisma from '../database/client';
import { Rewrite, Change } from '../types';

/**
 * Rewrite Repository
 * Handles all database operations related to resume rewrites
 */
export const RewriteRepository = {
  /**
   * Create a new rewrite
   */
  async createRewrite(data: {
    rewriteId: string;
    resumeId: string;
    originalText: string;
    rewrittenText: string;
    changes: Change[];
    scoreImprovement: any;
  }): Promise<Rewrite> {
    const rewrite = await prisma.rewrite.create({
      data: {
        id: data.rewriteId,
        resumeId: data.resumeId,
        originalText: data.originalText,
        rewrittenText: data.rewrittenText,
        changes: data.changes,
        scoreImprovement: data.scoreImprovement,
        version: 1
      }
    });

    return this.transformToRewrite(rewrite);
  },

  /**
   * Get rewrite by ID
   */
  async getRewriteById(rewriteId: string): Promise<Rewrite | null> {
    const rewrite = await prisma.rewrite.findUnique({
      where: { id: rewriteId }
    });

    if (!rewrite) return null;

    return this.transformToRewrite(rewrite);
  },

  /**
   * Get all rewrites for a resume
   * Sorted by generation date (newest first)
   */
  async getResumeRewrites(resumeId: string): Promise<Rewrite[]> {
    const rewrites = await prisma.rewrite.findMany({
      where: { resumeId },
      orderBy: { generatedAt: 'desc' }
    });

    return rewrites.map(r => this.transformToRewrite(r));
  },

  /**
   * Update a rewrite
   * Increments version number
   */
  async updateRewrite(
    rewriteId: string,
    updates: { rewrittenText?: string; changes?: Change[] }
  ): Promise<Rewrite | null> {
    try {
      const rewrite = await prisma.rewrite.update({
        where: { id: rewriteId },
        data: {
          rewrittenText: updates.rewrittenText,
          changes: updates.changes,
          version: {
            increment: 1
          }
        }
      });

      return this.transformToRewrite(rewrite);
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found
        return null;
      }
      throw error;
    }
  },

  /**
   * Transform database model to API Rewrite type
   */
  transformToRewrite(dbRewrite: any): Rewrite {
    return {
      rewriteId: dbRewrite.id,
      resumeId: dbRewrite.resumeId,
      originalText: dbRewrite.originalText,
      rewrittenText: dbRewrite.rewrittenText,
      changes: dbRewrite.changes as Change[],
      scoreImprovement: dbRewrite.scoreImprovement as any,
      version: dbRewrite.version,
      generatedAt: dbRewrite.generatedAt.toISOString(),
      updatedAt: dbRewrite.updatedAt.toISOString()
    };
  }
};
