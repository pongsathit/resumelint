import prisma from '../database/client';
import { Resume, Role } from '../types';

interface CreateResumeParams {
  userId: string;
  rawText: string;
  fileName: string;
  role: Role;
  parsedSections: any;
}

/**
 * Resume Repository
 * Handles all database operations related to resumes
 */
export const ResumeRepository = {
  /**
   * Create a new resume
   */
  async createResume(params: CreateResumeParams): Promise<Resume> {
    const resume = await prisma.resume.create({
      data: {
        userId: params.userId,
        fileName: params.fileName,
        rawText: params.rawText,
        parsedSections: params.parsedSections,
        role: params.role,
        status: 'parsed'
      }
    });

    return this.transformToResume(resume);
  },

  /**
   * Get resume by ID
   */
  async getResumeById(resumeId: string): Promise<Resume | null> {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });

    if (!resume) return null;

    return this.transformToResume(resume);
  },

  /**
   * Get all resumes for a user
   * Sorted by creation date (newest first)
   */
  async getUserResumes(userId: string): Promise<Resume[]> {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return resumes.map(r => this.transformToResume(r));
  },

  /**
   * Check if user owns a resume
   */
  async userOwnsResume(userId: string, resumeId: string): Promise<boolean> {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: { userId: true }
    });

    return resume?.userId === userId;
  },

  /**
   * Delete a resume
   * Cascade deletes all related data (analyses, matches, rewrites, etc.)
   */
  async deleteResume(resumeId: string): Promise<boolean> {
    try {
      await prisma.resume.delete({
        where: { id: resumeId }
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found
        return false;
      }
      throw error;
    }
  },

  /**
   * Check if resume has analyses
   */
  async hasAnalyses(resumeId: string): Promise<boolean> {
    const count = await prisma.analysis.count({
      where: { resumeId }
    });
    return count > 0;
  },

  /**
   * Check if resume has matches
   */
  async hasMatches(resumeId: string): Promise<boolean> {
    const count = await prisma.match.count({
      where: { resumeId }
    });
    return count > 0;
  },

  /**
   * Transform database model to API Resume type
   */
  transformToResume(dbResume: any): Resume {
    return {
      id: dbResume.id,
      userId: dbResume.userId,
      fileName: dbResume.fileName,
      rawText: dbResume.rawText,
      parsedSections: dbResume.parsedSections as any,
      role: dbResume.role as Role,
      status: dbResume.status as 'parsed' | 'processing' | 'error',
      createdAt: dbResume.createdAt.toISOString(),
      updatedAt: dbResume.updatedAt.toISOString()
    };
  }
};
