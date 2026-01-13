import prisma from '../database/client';
import { CareerGapAnalysis, LearningRoadmap, Role } from '../types';

/**
 * Career Repository
 * Handles all database operations related to career gap analysis and learning roadmaps
 */
export const CareerRepository = {
  /**
   * Create a new career gap analysis
   */
  async createGapAnalysis(data: {
    gapAnalysisId: string;
    resumeId: string;
    currentRole: Role;
    targetRole: Role;
    gaps: any;
    strengths: string[];
  }): Promise<CareerGapAnalysis> {
    const analysis = await prisma.careerGapAnalysis.create({
      data: {
        id: data.gapAnalysisId,
        resumeId: data.resumeId,
        currentRole: data.currentRole,
        targetRole: data.targetRole,
        gaps: data.gaps,
        strengths: data.strengths
      }
    });

    return this.transformToGapAnalysis(analysis);
  },

  /**
   * Get career gap analysis by ID
   */
  async getGapAnalysisById(gapAnalysisId: string): Promise<CareerGapAnalysis | null> {
    const analysis = await prisma.careerGapAnalysis.findUnique({
      where: { id: gapAnalysisId }
    });

    if (!analysis) return null;

    return this.transformToGapAnalysis(analysis);
  },

  /**
   * Create a new learning roadmap
   */
  async createLearningRoadmap(data: {
    roadmapId: string;
    gapAnalysisId: string;
    timeline: number;
    modules: any[];
    estimatedTotalHours: number;
  }): Promise<LearningRoadmap> {
    const roadmap = await prisma.learningRoadmap.create({
      data: {
        id: data.roadmapId,
        gapAnalysisId: data.gapAnalysisId,
        timeline: data.timeline,
        modules: data.modules,
        estimatedTotalHours: data.estimatedTotalHours
      }
    });

    return this.transformToLearningRoadmap(roadmap);
  },

  /**
   * Get learning roadmap by ID
   */
  async getLearningRoadmapById(roadmapId: string): Promise<LearningRoadmap | null> {
    const roadmap = await prisma.learningRoadmap.findUnique({
      where: { id: roadmapId }
    });

    if (!roadmap) return null;

    return this.transformToLearningRoadmap(roadmap);
  },

  /**
   * Update learning roadmap modules (for progress tracking)
   */
  async updateRoadmapModules(roadmapId: string, modules: any[]): Promise<LearningRoadmap | null> {
    try {
      const roadmap = await prisma.learningRoadmap.update({
        where: { id: roadmapId },
        data: { modules }
      });

      return this.transformToLearningRoadmap(roadmap);
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found
        return null;
      }
      throw error;
    }
  },

  /**
   * Transform database model to API CareerGapAnalysis type
   */
  transformToGapAnalysis(dbAnalysis: any): CareerGapAnalysis {
    return {
      gapAnalysisId: dbAnalysis.id,
      resumeId: dbAnalysis.resumeId,
      currentRole: dbAnalysis.currentRole as Role,
      targetRole: dbAnalysis.targetRole as Role,
      gaps: dbAnalysis.gaps as any,
      strengths: dbAnalysis.strengths as string[],
      generatedAt: dbAnalysis.generatedAt.toISOString()
    };
  },

  /**
   * Transform database model to API LearningRoadmap type
   */
  transformToLearningRoadmap(dbRoadmap: any): LearningRoadmap {
    return {
      roadmapId: dbRoadmap.id,
      gapAnalysisId: dbRoadmap.gapAnalysisId,
      timeline: dbRoadmap.timeline,
      modules: dbRoadmap.modules as any[],
      estimatedTotalHours: dbRoadmap.estimatedTotalHours,
      generatedAt: dbRoadmap.generatedAt.toISOString()
    };
  }
};
