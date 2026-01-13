import { v4 as uuidv4 } from 'uuid';
import { CareerGapAnalysis, LearningRoadmap, Module, Role } from '../types';
import { prisma } from '../utils/prisma';

const generateMockModules = (): Module[] => {
  return [
    {
      id: uuidv4(),
      week: 1,
      title: 'System Design Fundamentals',
      description: 'Learn the core principles of designing scalable systems',
      topics: [
        {
          title: 'Scalability Basics',
          description: 'Understanding horizontal vs vertical scaling, load balancing',
          links: [
            {
              title: 'System Design Primer',
              url: 'https://github.com/donnemartin/system-design-primer',
              type: 'documentation',
            },
            {
              title: 'Scalability Lecture - Harvard CS75',
              url: 'https://www.youtube.com/watch?v=-W9F__D3oY4',
              type: 'video',
            },
          ],
          estimatedHours: 5,
          completed: false,
        },
        {
          title: 'Database Scaling',
          description: 'Sharding, replication, and CAP theorem',
          links: [
            {
              title: 'Database Scaling Patterns',
              url: 'https://medium.com/system-design-blog/database-scaling-patterns',
              type: 'article',
            },
          ],
          estimatedHours: 4,
          completed: false,
        },
      ],
      completed: false,
    },
    {
      id: uuidv4(),
      week: 2,
      title: 'Distributed Systems',
      description: 'Deep dive into distributed computing concepts',
      topics: [
        {
          title: 'Consistency Models',
          description: 'Eventual consistency, strong consistency, CAP theorem',
          links: [
            {
              title: 'Designing Data-Intensive Applications',
              url: 'https://dataintensive.net/',
              type: 'course',
            },
          ],
          estimatedHours: 6,
          completed: false,
        },
        {
          title: 'Consensus Algorithms',
          description: 'Raft, Paxos, and distributed consensus',
          links: [
            {
              title: 'Raft Consensus Algorithm',
              url: 'https://raft.github.io/',
              type: 'documentation',
            },
          ],
          estimatedHours: 5,
          completed: false,
        },
      ],
      completed: false,
    },
    {
      id: uuidv4(),
      week: 3,
      title: 'Microservices Architecture',
      description: 'Advanced patterns for microservices',
      topics: [
        {
          title: 'Service Communication',
          description: 'REST, gRPC, message queues, event-driven architecture',
          links: [
            {
              title: 'Microservices Patterns',
              url: 'https://microservices.io/patterns/',
              type: 'documentation',
            },
          ],
          estimatedHours: 5,
          completed: false,
        },
        {
          title: 'API Gateway and Service Mesh',
          description: 'Understanding Kong, Istio, and service discovery',
          links: [
            {
              title: 'Introduction to Service Mesh',
              url: 'https://www.redhat.com/en/topics/microservices/what-is-a-service-mesh',
              type: 'article',
            },
          ],
          estimatedHours: 4,
          completed: false,
        },
      ],
      completed: false,
    },
    {
      id: uuidv4(),
      week: 4,
      title: 'Leadership and Communication',
      description: 'Building technical leadership skills',
      topics: [
        {
          title: 'Technical Decision Making',
          description: 'Architecture decision records, RFC process',
          links: [
            {
              title: "The Staff Engineer's Path",
              url: 'https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/',
              type: 'course',
            },
          ],
          estimatedHours: 4,
          completed: false,
        },
        {
          title: 'Mentoring and Code Review',
          description: 'Best practices for guiding other engineers',
          links: [
            {
              title: 'Effective Code Review',
              url: 'https://google.github.io/eng-practices/review/',
              type: 'documentation',
            },
          ],
          estimatedHours: 3,
          completed: false,
        },
      ],
      completed: false,
    },
  ];
};

export const careerService = {
  createCareerGapAnalysis: async (params: {
    resumeId: string;
    currentRole: Role;
    targetRole: Role;
  }): Promise<CareerGapAnalysis> => {
    const gapAnalysisId = uuidv4();

    const gaps = {
      technicalSkills: [
        {
          skill: 'System Design',
          currentLevel: 'intermediate' as const,
          requiredLevel: 'expert' as const,
          gap: 'large' as const,
          importance: 'high' as const,
        },
        {
          skill: 'Distributed Systems',
          currentLevel: 'beginner' as const,
          requiredLevel: 'expert' as const,
          gap: 'large' as const,
          importance: 'high' as const,
        },
        {
          skill: 'Performance Optimization',
          currentLevel: 'intermediate' as const,
          requiredLevel: 'expert' as const,
          gap: 'large' as const,
          importance: 'high' as const,
        },
      ],
      systemDesign: [
        {
          skill: 'Distributed Systems',
          gap: 'missing' as const,
          recommendation: 'Learn about CAP theorem, eventual consistency, and distributed consensus algorithms like Raft and Paxos',
        },
        {
          skill: 'Scalability Patterns',
          gap: 'large' as const,
          recommendation: 'Study horizontal scaling, load balancing, caching strategies, and database sharding',
        },
        {
          skill: 'Microservices Architecture',
          gap: 'large' as const,
          recommendation: 'Deepen understanding of service mesh, API gateway patterns, and inter-service communication',
        },
      ],
      leadership: [
        {
          skill: 'Team Leadership',
          gap: 'large' as const,
          recommendation: 'Gain experience leading larger teams (10+ engineers), managing technical roadmaps, and mentoring senior engineers',
        },
        {
          skill: 'Cross-functional Collaboration',
          gap: 'large' as const,
          recommendation: 'Work closely with product, design, and business stakeholders on strategic initiatives',
        },
        {
          skill: 'Technical Strategy',
          gap: 'missing' as const,
          recommendation: 'Develop skills in technology evaluation, architecture decision-making, and long-term technical planning',
        },
      ],
    };

    const strengths = [
      'Strong foundation in backend development with Node.js and TypeScript',
      'Experience building microservices',
      'Good understanding of database technologies',
      'Team collaboration experience',
    ];

    try {
      const dbGapAnalysis = await prisma.career_gap_analyses.create({
        data: {
          id: gapAnalysisId,
          resumeId: params.resumeId,
          currentRole: params.currentRole,
          targetRole: params.targetRole,
          gaps: gaps as any,
          strengths: strengths as any,
        },
      });

      return {
        gapAnalysisId: dbGapAnalysis.id,
        resumeId: dbGapAnalysis.resumeId,
        currentRole: dbGapAnalysis.currentRole as Role,
        targetRole: dbGapAnalysis.targetRole as Role,
        gaps: dbGapAnalysis.gaps as unknown as CareerGapAnalysis['gaps'],
        strengths: dbGapAnalysis.strengths as unknown as string[],
        generatedAt: dbGapAnalysis.generatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error creating career gap analysis:', error);
      throw new Error('Failed to create career gap analysis');
    }
  },

  getCareerGapAnalysisById: async (gapAnalysisId: string): Promise<CareerGapAnalysis | null> => {
    try {
      const dbGapAnalysis = await prisma.career_gap_analyses.findUnique({
        where: { id: gapAnalysisId },
      });

      if (!dbGapAnalysis) {
        return null;
      }

      return {
        gapAnalysisId: dbGapAnalysis.id,
        resumeId: dbGapAnalysis.resumeId,
        currentRole: dbGapAnalysis.currentRole as Role,
        targetRole: dbGapAnalysis.targetRole as Role,
        gaps: dbGapAnalysis.gaps as unknown as CareerGapAnalysis['gaps'],
        strengths: dbGapAnalysis.strengths as unknown as string[],
        generatedAt: dbGapAnalysis.generatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error fetching career gap analysis by ID:', error);
      return null;
    }
  },

  createLearningRoadmap: async (params: { gapAnalysisId: string; timeline?: number }): Promise<LearningRoadmap> => {
    const roadmapId = uuidv4();
    const modules = generateMockModules();

    try {
      const dbRoadmap = await prisma.learning_roadmaps.create({
        data: {
          id: roadmapId,
          gapAnalysisId: params.gapAnalysisId,
          timeline: params.timeline || 30,
          modules: modules as any,
          estimatedTotalHours: 40,
        },
      });

      return {
        roadmapId: dbRoadmap.id,
        gapAnalysisId: dbRoadmap.gapAnalysisId,
        timeline: dbRoadmap.timeline,
        modules: dbRoadmap.modules as unknown as Module[],
        estimatedTotalHours: dbRoadmap.estimatedTotalHours,
        generatedAt: dbRoadmap.generatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error creating learning roadmap:', error);
      throw new Error('Failed to create learning roadmap');
    }
  },

  getLearningRoadmapById: async (roadmapId: string): Promise<LearningRoadmap | null> => {
    try {
      const dbRoadmap = await prisma.learning_roadmaps.findUnique({
        where: { id: roadmapId },
      });

      if (!dbRoadmap) {
        return null;
      }

      return {
        roadmapId: dbRoadmap.id,
        gapAnalysisId: dbRoadmap.gapAnalysisId,
        timeline: dbRoadmap.timeline,
        modules: dbRoadmap.modules as unknown as Module[],
        estimatedTotalHours: dbRoadmap.estimatedTotalHours,
        generatedAt: dbRoadmap.generatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error fetching learning roadmap by ID:', error);
      return null;
    }
  },

  updateRoadmapProgress: (roadmap: LearningRoadmap, moduleId: string, topicId?: string, completed?: boolean) => {
    const module = roadmap.modules.find((m) => m.id === moduleId);
    if (module && topicId) {
      const topic = module.topics.find((t) => t.title === topicId);
      if (topic && completed !== undefined) {
        topic.completed = completed;
      }
      module.completed = module.topics.every((t) => t.completed);
    }

    let completedModules = 0;
    let completedTopics = 0;
    let totalTopics = 0;

    roadmap.modules.forEach((m) => {
      if (m.completed) completedModules++;
      m.topics.forEach((t) => {
        totalTopics++;
        if (t.completed) completedTopics++;
      });
    });

    return {
      completedModules,
      totalModules: roadmap.modules.length,
      completedTopics,
      totalTopics,
      progressPercentage: Math.round((completedTopics / totalTopics) * 100),
    };
  },
};
