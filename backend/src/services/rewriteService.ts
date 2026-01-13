import { v4 as uuidv4 } from 'uuid';
import { Rewrite, Change } from '../types';
import { prisma } from '../utils/prisma';

const generateMockChanges = (): Change[] => {
  return [
    {
      section: 'experience',
      originalBullet: 'Built scalable microservices',
      rewrittenBullet: 'Architected and deployed 5 microservices handling 1M+ daily requests, achieving 99.9% uptime through strategic implementation of circuit breakers and auto-scaling policies',
      improvements: ['quantified_impact', 'star_method', 'technical_depth'],
      explanation: 'Added specific metrics (5 microservices, 1M+ requests, 99.9% uptime) and technical details (circuit breakers, auto-scaling) to demonstrate scale and expertise',
    },
    {
      section: 'experience',
      originalBullet: 'Led team of 5 engineers',
      rewrittenBullet: 'Led cross-functional team of 5 engineers through a critical microservices migration, resulting in 40% reduction in infrastructure costs and 60% improvement in API response times',
      improvements: ['quantified_impact', 'star_method', 'business_value'],
      explanation: 'Transformed generic leadership statement into STAR format with quantifiable business outcomes (40% cost reduction, 60% performance improvement)',
    },
    {
      section: 'projects',
      originalBullet: 'Built a full-stack e-commerce platform',
      rewrittenBullet: 'Developed full-stack e-commerce platform using React and Node.js, processing $500K in transactions monthly with 10,000+ active users and achieving 95% customer satisfaction score',
      improvements: ['quantified_impact', 'metrics', 'ats_keywords'],
      explanation: 'Added concrete metrics (revenue, users, satisfaction) and specific technologies for ATS optimization',
    },
  ];
};

const generateRewrittenText = (originalText: string): string => {
  return `${originalText}\n\n[REWRITTEN VERSION]\n\nJohn Doe\nSenior Software Engineer\n\nPROFESSIONAL EXPERIENCE\n\nSenior Backend Engineer | Tech Corp | 2020-2024\n• Architected and deployed 5 microservices handling 1M+ daily requests, achieving 99.9% uptime through strategic implementation of circuit breakers and auto-scaling policies\n• Led cross-functional team of 5 engineers through a critical microservices migration, resulting in 40% reduction in infrastructure costs and 60% improvement in API response times\n• Implemented comprehensive CI/CD pipeline using GitHub Actions and Docker, reducing deployment time by 75% and eliminating production incidents\n\nPROJECTS\n• E-commerce Platform: Developed full-stack e-commerce platform using React and Node.js, processing $500K in transactions monthly with 10,000+ active users and achieving 95% customer satisfaction score`;
};

export const rewriteService = {
  createRewrite: async (resumeId: string, originalText: string): Promise<Rewrite> => {
    const rewriteId = uuidv4();
    const changes = generateMockChanges();
    const scoreImprovement = {
      before: 65,
      after: 85,
      delta: 20,
    };

    try {
      const dbRewrite = await prisma.rewrites.create({
        data: {
          id: rewriteId,
          resumeId,
          originalText,
          rewrittenText: generateRewrittenText(originalText),
          changes: changes as any,
          scoreImprovement: scoreImprovement as any,
          version: 1,
          updatedAt: new Date(),
        },
      });

      return {
        rewriteId: dbRewrite.id,
        resumeId: dbRewrite.resumeId,
        originalText: dbRewrite.originalText,
        rewrittenText: dbRewrite.rewrittenText,
        changes: dbRewrite.changes as unknown as Change[],
        scoreImprovement: dbRewrite.scoreImprovement as Rewrite['scoreImprovement'],
        version: dbRewrite.version,
        generatedAt: dbRewrite.generatedAt.toISOString(),
        updatedAt: dbRewrite.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error creating rewrite:', error);
      throw new Error('Failed to create rewrite');
    }
  },

  getRewriteById: async (rewriteId: string): Promise<Rewrite | null> => {
    try {
      const dbRewrite = await prisma.rewrites.findUnique({
        where: { id: rewriteId },
      });

      if (!dbRewrite) {
        return null;
      }

      return {
        rewriteId: dbRewrite.id,
        resumeId: dbRewrite.resumeId,
        originalText: dbRewrite.originalText,
        rewrittenText: dbRewrite.rewrittenText,
        changes: dbRewrite.changes as unknown as Change[],
        scoreImprovement: dbRewrite.scoreImprovement as Rewrite['scoreImprovement'],
        version: dbRewrite.version,
        generatedAt: dbRewrite.generatedAt.toISOString(),
        updatedAt: dbRewrite.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error fetching rewrite by ID:', error);
      return null;
    }
  },

  getResumeRewrites: async (resumeId: string): Promise<Rewrite[]> => {
    try {
      const dbRewrites = await prisma.rewrites.findMany({
        where: { resumeId },
        orderBy: { generatedAt: 'desc' },
      });

      return dbRewrites.map((dbRewrite) => ({
        rewriteId: dbRewrite.id,
        resumeId: dbRewrite.resumeId,
        originalText: dbRewrite.originalText,
        rewrittenText: dbRewrite.rewrittenText,
        changes: dbRewrite.changes as unknown as Change[],
        scoreImprovement: dbRewrite.scoreImprovement as Rewrite['scoreImprovement'],
        version: dbRewrite.version,
        generatedAt: dbRewrite.generatedAt.toISOString(),
        updatedAt: dbRewrite.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching resume rewrites:', error);
      return [];
    }
  },

  updateRewrite: async (rewriteId: string, updates: { rewrittenText?: string; changes?: Change[] }): Promise<Rewrite | null> => {
    try {
      const existingRewrite = await prisma.rewrites.findUnique({
        where: { id: rewriteId },
      });

      if (!existingRewrite) {
        return null;
      }

      const updateData: any = {
        version: existingRewrite.version + 1,
        updatedAt: new Date(),
      };

      if (updates.rewrittenText) {
        updateData.rewrittenText = updates.rewrittenText;
      }
      if (updates.changes) {
        updateData.changes = updates.changes as any;
      }

      const dbRewrite = await prisma.rewrites.update({
        where: { id: rewriteId },
        data: updateData,
      });

      return {
        rewriteId: dbRewrite.id,
        resumeId: dbRewrite.resumeId,
        originalText: dbRewrite.originalText,
        rewrittenText: dbRewrite.rewrittenText,
        changes: dbRewrite.changes as unknown as Change[],
        scoreImprovement: dbRewrite.scoreImprovement as Rewrite['scoreImprovement'],
        version: dbRewrite.version,
        generatedAt: dbRewrite.generatedAt.toISOString(),
        updatedAt: dbRewrite.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error updating rewrite:', error);
      return null;
    }
  },

  improveRewrite: (prompt: string) => {
    return {
      rewrittenBullet: 'Spearheaded development of cloud-native microservices architecture serving 2M+ daily users across 15 countries, achieving 99.95% uptime and reducing infrastructure costs by 45% through strategic AWS optimization',
      explanation: `Applied your feedback: "${prompt}". Enhanced the bullet point with more specific metrics, geographic scope, and platform details to strengthen impact and demonstrate scale.`,
      improvements: ['global_scale', 'enhanced_metrics', 'platform_specificity'],
    };
  },
};
