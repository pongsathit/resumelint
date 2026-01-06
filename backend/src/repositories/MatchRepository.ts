import prisma from '../database/client';
import { Match, JobDescription } from '../types';

/**
 * Match Repository
 * Handles all database operations related to job matching
 */
export const MatchRepository = {
  /**
   * Create a new job description
   */
  async createJobDescription(data: {
    id: string;
    userId?: string;
    rawText: string;
    title: string;
    company: string;
  }): Promise<JobDescription> {
    const jd = await prisma.jobDescription.create({
      data: {
        id: data.id,
        userId: data.userId,
        rawText: data.rawText,
        title: data.title,
        company: data.company
      }
    });

    return this.transformToJobDescription(jd);
  },

  /**
   * Get job description by ID
   */
  async getJobDescriptionById(jdId: string): Promise<JobDescription | null> {
    const jd = await prisma.jobDescription.findUnique({
      where: { id: jdId }
    });

    if (!jd) return null;

    return this.transformToJobDescription(jd);
  },

  /**
   * Create a new match
   */
  async createMatch(data: {
    matchId: string;
    resumeId: string;
    jobDescriptionId: string;
    matchScore: number;
    breakdown: any;
    missingKeywords: any[];
    strengths: any[];
    aiExplanation: any;
  }): Promise<Match> {
    const match = await prisma.match.create({
      data: {
        id: data.matchId,
        resumeId: data.resumeId,
        jobDescriptionId: data.jobDescriptionId,
        matchScore: data.matchScore,
        breakdown: data.breakdown,
        missingKeywords: data.missingKeywords,
        strengths: data.strengths,
        aiExplanation: data.aiExplanation
      }
    });

    return this.transformToMatch(match);
  },

  /**
   * Get match by ID
   */
  async getMatchById(matchId: string): Promise<Match | null> {
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    });

    if (!match) return null;

    return this.transformToMatch(match);
  },

  /**
   * Get all matches for a resume
   * Sorted by generation date (newest first)
   */
  async getResumeMatches(resumeId: string): Promise<Match[]> {
    const matches = await prisma.match.findMany({
      where: { resumeId },
      orderBy: { generatedAt: 'desc' }
    });

    return matches.map(m => this.transformToMatch(m));
  },

  /**
   * Transform database model to API JobDescription type
   */
  transformToJobDescription(dbJd: any): JobDescription {
    return {
      id: dbJd.id,
      userId: dbJd.userId,
      rawText: dbJd.rawText,
      title: dbJd.title,
      company: dbJd.company,
      createdAt: dbJd.createdAt.toISOString()
    };
  },

  /**
   * Transform database model to API Match type
   */
  transformToMatch(dbMatch: any): Match {
    return {
      matchId: dbMatch.id,
      resumeId: dbMatch.resumeId,
      jobDescriptionId: dbMatch.jobDescriptionId,
      matchScore: dbMatch.matchScore,
      breakdown: dbMatch.breakdown as any,
      missingKeywords: dbMatch.missingKeywords as any[],
      strengths: dbMatch.strengths as any[],
      aiExplanation: dbMatch.aiExplanation as any,
      generatedAt: dbMatch.generatedAt.toISOString()
    };
  }
};
