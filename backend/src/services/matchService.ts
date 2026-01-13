import { v4 as uuidv4 } from 'uuid';
import { JobDescription, Match, MissingKeyword, Strength } from '../types';
import { prisma } from '../utils/prisma';

const generateMockMissingKeywords = (): MissingKeyword[] => {
  return [
    {
      keyword: 'Docker',
      importance: 'high',
      frequency: 5,
    },
    {
      keyword: 'GraphQL',
      importance: 'high',
      frequency: 4,
    },
    {
      keyword: 'Redis',
      importance: 'medium',
      frequency: 3,
    },
    {
      keyword: 'CI/CD',
      importance: 'medium',
      frequency: 2,
    },
  ];
};

const generateMockStrengths = (): Strength[] => {
  return [
    {
      keyword: 'Node.js',
      matchStrength: 'high',
      context: 'Strong experience with Node.js in building scalable backend systems',
    },
    {
      keyword: 'TypeScript',
      matchStrength: 'high',
      context: 'Proficient in TypeScript for type-safe development',
    },
    {
      keyword: 'PostgreSQL',
      matchStrength: 'medium',
      context: 'Database experience matches job requirements',
    },
  ];
};

export const matchService = {
  createJobDescription: async (params: {
    userId?: string;
    rawText: string;
    title?: string;
    company?: string;
  }): Promise<JobDescription> => {
    const jdId = uuidv4();

    try {
      const dbJobDescription = await prisma.job_descriptions.create({
        data: {
          id: jdId,
          userId: params.userId,
          rawText: params.rawText,
          title: params.title || 'Software Engineer',
          company: params.company || 'Tech Company',
        },
      });

      return {
        id: dbJobDescription.id,
        userId: dbJobDescription.userId || undefined,
        rawText: dbJobDescription.rawText,
        title: dbJobDescription.title,
        company: dbJobDescription.company,
        createdAt: dbJobDescription.createdAt.toISOString(),
      };
    } catch (error) {
      console.error('Error creating job description:', error);
      throw new Error('Failed to create job description');
    }
  },

  createMatch: async (resumeId: string, jobDescriptionId: string): Promise<Match> => {
    const matchId = uuidv4();

    const breakdown = {
      keywords: 82,
      experience: 65,
      skills: 70,
      education: 80,
    };

    const aiExplanation = {
      summary: 'Your resume is a 75% match for this position. You have strong technical skills but are missing some key technologies mentioned in the job description.',
      whyMismatch: 'The job description emphasizes containerization (Docker) and GraphQL experience, which are not evident in your resume. Additionally, CI/CD pipeline experience could be highlighted more prominently.',
      priorityChanges: [
        'Add Docker and containerization experience to your skills and project descriptions',
        "Include any GraphQL API development work you've done",
        'Highlight CI/CD pipeline setup and automation experience',
      ],
      improvementTips: [
        'Add a project showcasing microservices architecture with Docker',
        'Mention specific GraphQL implementations if applicable',
        'Quantify the impact of your automation work',
        'Align your technical skills section with the job requirements',
      ],
    };

    try {
      const dbMatch = await prisma.matches.create({
        data: {
          id: matchId,
          resumeId,
          jobDescriptionId,
          matchScore: 75,
          breakdown: breakdown as any,
          missingKeywords: generateMockMissingKeywords() as any,
          strengths: generateMockStrengths() as any,
          aiExplanation: aiExplanation as any,
        },
      });

      return {
        matchId: dbMatch.id,
        resumeId: dbMatch.resumeId,
        jobDescriptionId: dbMatch.jobDescriptionId,
        matchScore: dbMatch.matchScore,
        breakdown: dbMatch.breakdown as Match['breakdown'],
        missingKeywords: dbMatch.missingKeywords as unknown as MissingKeyword[],
        strengths: dbMatch.strengths as unknown as Strength[],
        aiExplanation: dbMatch.aiExplanation as Match['aiExplanation'],
        generatedAt: dbMatch.generatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error creating match:', error);
      throw new Error('Failed to create match');
    }
  },

  getMatchById: async (matchId: string): Promise<Match | null> => {
    try {
      const dbMatch = await prisma.matches.findUnique({
        where: { id: matchId },
      });

      if (!dbMatch) {
        return null;
      }

      return {
        matchId: dbMatch.id,
        resumeId: dbMatch.resumeId,
        jobDescriptionId: dbMatch.jobDescriptionId,
        matchScore: dbMatch.matchScore,
        breakdown: dbMatch.breakdown as Match['breakdown'],
        missingKeywords: dbMatch.missingKeywords as unknown as MissingKeyword[],
        strengths: dbMatch.strengths as unknown as Strength[],
        aiExplanation: dbMatch.aiExplanation as Match['aiExplanation'],
        generatedAt: dbMatch.generatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error fetching match by ID:', error);
      return null;
    }
  },

  getResumeMatches: async (resumeId: string): Promise<Match[]> => {
    try {
      const dbMatches = await prisma.matches.findMany({
        where: { resumeId },
        orderBy: { generatedAt: 'desc' },
      });

      return dbMatches.map((dbMatch) => ({
        matchId: dbMatch.id,
        resumeId: dbMatch.resumeId,
        jobDescriptionId: dbMatch.jobDescriptionId,
        matchScore: dbMatch.matchScore,
        breakdown: dbMatch.breakdown as Match['breakdown'],
        missingKeywords: dbMatch.missingKeywords as unknown as MissingKeyword[],
        strengths: dbMatch.strengths as unknown as Strength[],
        aiExplanation: dbMatch.aiExplanation as Match['aiExplanation'],
        generatedAt: dbMatch.generatedAt.toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching resume matches:', error);
      return [];
    }
  },

  getJobDescriptionById: async (jdId: string): Promise<JobDescription | null> => {
    try {
      const dbJobDescription = await prisma.job_descriptions.findUnique({
        where: { id: jdId },
      });

      if (!dbJobDescription) {
        return null;
      }

      return {
        id: dbJobDescription.id,
        userId: dbJobDescription.userId || undefined,
        rawText: dbJobDescription.rawText,
        title: dbJobDescription.title,
        company: dbJobDescription.company,
        createdAt: dbJobDescription.createdAt.toISOString(),
      };
    } catch (error) {
      console.error('Error fetching job description by ID:', error);
      return null;
    }
  },
};
