import { v4 as uuidv4 } from 'uuid';
import { Analysis, Suggestion, Role } from '../types';
import { AI_CONFIG } from '../config/ai';
import { openaiService } from './ai/openaiService';
import { parseAnalysisResponse } from './ai/parsers/analysisParser';
import { aiCache } from './ai/cache/cacheService';
import { resumeService } from './resumeService';
import { prisma } from '../utils/prisma';

const generateMockSuggestions = (targetRole: Role): Suggestion[] => {
  return [
    {
      id: uuidv4(),
      section: 'experience',
      severity: 'critical',
      title: 'Quantify Your Impact',
      description: 'Add specific metrics to demonstrate the scale and impact of your work',
      originalText: 'Built scalable microservices',
      suggestedText: 'Built scalable microservices handling 1M+ requests/day with 99.9% uptime',
      reasoning: 'Adding quantifiable metrics makes your achievements more concrete and impressive to recruiters',
    },
    {
      id: uuidv4(),
      section: 'experience',
      severity: 'warning',
      title: 'Use STAR Method',
      description: 'Structure your bullet points using Situation, Task, Action, Result format',
      originalText: 'Led team of 5 engineers',
      suggestedText: 'Led cross-functional team of 5 engineers to deliver a critical microservices migration, reducing infrastructure costs by 40% and improving response times by 60%',
      reasoning: 'STAR method provides context and demonstrates leadership impact with measurable outcomes',
    },
    {
      id: uuidv4(),
      section: 'skills',
      severity: 'info',
      title: 'Add Relevant Technologies',
      description: `For ${targetRole} role, consider adding: GraphQL, Redis, AWS Lambda`,
      originalText: 'Node.js, TypeScript, PostgreSQL',
      suggestedText: 'Node.js, TypeScript, PostgreSQL, GraphQL, Redis, AWS Lambda',
      reasoning: 'These technologies are commonly required for modern backend engineering roles',
    },
  ];
};

export const analysisService = {
  /**
   * Create a resume analysis using AI or mock data
   * @param resumeId ID of the resume to analyze
   * @param targetRole Target role for analysis
   * @returns Analysis object with scores and suggestions
   */
  createAnalysis: async (resumeId: string, targetRole: Role): Promise<Analysis> => {
    const resume = await resumeService.getResumeById(resumeId);
    if (!resume) {
      throw new Error('Resume not found');
    }

    // Use AI if enabled
    if (AI_CONFIG.enabled) {
      try {
        // Check cache first
        const cacheKey = aiCache.generateKey(resume.rawText, targetRole);
        const cachedAnalysis = aiCache.get(cacheKey);

        if (cachedAnalysis) {
          console.log(`✓ Cache hit for analysis: ${resumeId}`);
          return cachedAnalysis;
        }

        console.log(`→ Calling OpenAI API for analysis: ${resumeId}`);

        // Call OpenAI API
        const aiResponse = await openaiService.analyzeResume(resume.rawText, targetRole);

        // Parse and validate response
        const analysis = parseAnalysisResponse(aiResponse, resumeId);

        // Store in cache
        aiCache.set(cacheKey, analysis);

        // Save to database using Prisma
        await prisma.analyses.create({
          data: {
            id: analysis.analysisId,
            resumeId: analysis.resumeId,
            scores: analysis.scores as any,
            suggestions: analysis.suggestions as any,
            summary: analysis.summary,
            generatedAt: new Date(analysis.generatedAt),
          },
        });

        console.log(`✓ AI analysis completed and saved to database: ${analysis.analysisId}`);

        return analysis;
      } catch (error: any) {
        console.error('AI analysis failed:', error.message);
        // Re-throw error to be handled by controller
        throw error;
      }
    }

    // Fallback to mock implementation when AI is disabled
    console.log(`→ Using mock analysis (AI disabled): ${resumeId}`);
    const analysisId = uuidv4();
    const suggestions = generateMockSuggestions(targetRole);

    const analysis: Analysis = {
      analysisId,
      resumeId,
      scores: {
        overall: 82,
        clarity: 90,
        impact: 65,
        atsFriendliness: 88,
        technicalDepth: 85,
      },
      suggestions,
      summary: `Your resume shows strong technical foundation for a ${targetRole} position. Key areas for improvement: quantifying impact with metrics (65% score), adding more context using STAR method, and ensuring ATS compatibility. Your technical depth is solid, but adding specific project outcomes would strengthen your profile.`,
      generatedAt: new Date().toISOString(),
    };

    // Save mock analysis to database as well
    await prisma.analyses.create({
      data: {
        id: analysisId,
        resumeId,
        scores: analysis.scores as any,
        suggestions: analysis.suggestions as any,
        summary: analysis.summary,
        generatedAt: new Date(analysis.generatedAt),
      },
    });

    console.log(`✓ Mock analysis saved to database: ${analysisId}`);

    return analysis;
  },

  getAnalysisById: async (analysisId: string): Promise<Analysis | null> => {
    try {
      const dbAnalysis = await prisma.analyses.findUnique({
        where: { id: analysisId },
      });

      if (!dbAnalysis) {
        return null;
      }

      return {
        analysisId: dbAnalysis.id,
        resumeId: dbAnalysis.resumeId,
        scores: dbAnalysis.scores as unknown as Analysis['scores'],
        suggestions: dbAnalysis.suggestions as unknown as Suggestion[],
        summary: dbAnalysis.summary,
        generatedAt: dbAnalysis.generatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error fetching analysis by ID:', error);
      return null;
    }
  },

  getLatestResumeAnalysis: async (resumeId: string): Promise<Analysis | null> => {
    try {
      const dbAnalysis = await prisma.analyses.findFirst({
        where: { resumeId },
        orderBy: { generatedAt: 'desc' },
      });

      if (!dbAnalysis) {
        return null;
      }

      return {
        analysisId: dbAnalysis.id,
        resumeId: dbAnalysis.resumeId,
        scores: dbAnalysis.scores as unknown as Analysis['scores'],
        suggestions: dbAnalysis.suggestions as unknown as Suggestion[],
        summary: dbAnalysis.summary,
        generatedAt: dbAnalysis.generatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error fetching latest resume analysis:', error);
      return null;
    }
  },
};
