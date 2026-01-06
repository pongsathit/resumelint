import prisma from '../database/client';
import { Analysis } from '../types';

/**
 * Analysis Repository
 * Handles all database operations related to resume analyses
 */
export const AnalysisRepository = {
  /**
   * Create a new analysis
   */
  async createAnalysis(data: {
    analysisId: string;
    resumeId: string;
    scores: any;
    suggestions: any[];
    summary: string;
  }): Promise<Analysis> {
    const analysis = await prisma.analysis.create({
      data: {
        id: data.analysisId,
        resumeId: data.resumeId,
        scores: data.scores,
        suggestions: data.suggestions,
        summary: data.summary
      }
    });

    return this.transformToAnalysis(analysis);
  },

  /**
   * Get analysis by ID
   */
  async getAnalysisById(analysisId: string): Promise<Analysis | null> {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId }
    });

    if (!analysis) return null;

    return this.transformToAnalysis(analysis);
  },

  /**
   * Get all analyses for a resume
   * Sorted by generation date (newest first)
   */
  async getResumeAnalyses(resumeId: string): Promise<Analysis[]> {
    const analyses = await prisma.analysis.findMany({
      where: { resumeId },
      orderBy: { generatedAt: 'desc' }
    });

    return analyses.map(a => this.transformToAnalysis(a));
  },

  /**
   * Get the latest analysis for a resume
   */
  async getLatestAnalysis(resumeId: string): Promise<Analysis | null> {
    const analysis = await prisma.analysis.findFirst({
      where: { resumeId },
      orderBy: { generatedAt: 'desc' }
    });

    if (!analysis) return null;

    return this.transformToAnalysis(analysis);
  },

  /**
   * Transform database model to API Analysis type
   */
  transformToAnalysis(dbAnalysis: any): Analysis {
    return {
      analysisId: dbAnalysis.id,
      resumeId: dbAnalysis.resumeId,
      scores: dbAnalysis.scores as any,
      suggestions: dbAnalysis.suggestions as any[],
      summary: dbAnalysis.summary,
      generatedAt: dbAnalysis.generatedAt.toISOString()
    };
  }
};
