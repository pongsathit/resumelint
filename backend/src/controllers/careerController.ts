import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { resumes, careerGapAnalyses, learningRoadmaps, mockHelpers } from '../models/mockData';
import { CareerGapAnalysis, LearningRoadmap, Module, Topic } from '../types';

export const careerController = {
  // POST /api/career-gap
  analyzeCareerGap: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    if (req.user.subscriptionTier !== 'pro') {
      return res.status(403).json({
        error: 'forbidden',
        message: 'This feature requires Pro tier subscription'
      });
    }

    const { resumeId, currentRole, targetRole, targetLevel } = req.body;

    const resume = resumes.get(resumeId);

    if (!resume) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Resume not found'
      });
    }

    if (!mockHelpers.userOwnsResume(req.user.id, resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    // Generate mock career gap analysis
    const gapAnalysisId = uuidv4();

    const analysis: CareerGapAnalysis = {
      gapAnalysisId,
      resumeId,
      currentRole,
      targetRole,
      gaps: {
        technicalSkills: [
          {
            skill: 'System Design',
            currentLevel: 'intermediate',
            requiredLevel: 'expert',
            gap: 'large',
            importance: 'critical'
          },
          {
            skill: 'Distributed Systems',
            currentLevel: 'beginner',
            requiredLevel: 'expert',
            gap: 'large',
            importance: 'high'
          },
          {
            skill: 'Performance Optimization',
            currentLevel: 'intermediate',
            requiredLevel: 'expert',
            gap: 'large',
            importance: 'high'
          }
        ],
        systemDesign: [
          {
            skill: 'Distributed Systems',
            gap: 'missing',
            recommendation: 'Learn about CAP theorem, eventual consistency, and distributed consensus algorithms like Raft and Paxos'
          },
          {
            skill: 'Scalability Patterns',
            gap: 'large',
            recommendation: 'Study horizontal scaling, load balancing, caching strategies, and database sharding'
          },
          {
            skill: 'Microservices Architecture',
            gap: 'large',
            recommendation: 'Deepen understanding of service mesh, API gateway patterns, and inter-service communication'
          }
        ],
        leadership: [
          {
            skill: 'Team Leadership',
            gap: 'large',
            recommendation: 'Gain experience leading larger teams (10+ engineers), managing technical roadmaps, and mentoring senior engineers'
          },
          {
            skill: 'Cross-functional Collaboration',
            gap: 'large',
            recommendation: 'Work closely with product, design, and business stakeholders on strategic initiatives'
          },
          {
            skill: 'Technical Strategy',
            gap: 'missing',
            recommendation: 'Develop skills in technology evaluation, architecture decision-making, and long-term technical planning'
          }
        ]
      },
      strengths: [
        'Strong foundation in backend development with Node.js and TypeScript',
        'Experience building microservices',
        'Good understanding of database technologies',
        'Team collaboration experience'
      ],
      generatedAt: new Date().toISOString()
    };

    careerGapAnalyses.set(gapAnalysisId, analysis);

    res.json(analysis);
  },

  // GET /api/career-gap/:gapAnalysisId
  getCareerGapAnalysis: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    if (req.user.subscriptionTier !== 'pro') {
      return res.status(403).json({
        error: 'forbidden',
        message: 'This feature requires Pro tier subscription'
      });
    }

    const { gapAnalysisId } = req.params;
    const analysis = careerGapAnalyses.get(gapAnalysisId);

    if (!analysis) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Career gap analysis not found'
      });
    }

    if (!mockHelpers.userOwnsResume(req.user.id, analysis.resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    res.json(analysis);
  },

  // POST /api/learning-roadmap
  createLearningRoadmap: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    if (req.user.subscriptionTier !== 'pro') {
      return res.status(403).json({
        error: 'forbidden',
        message: 'This feature requires Pro tier subscription'
      });
    }

    const { gapAnalysisId, timeline, focusAreas } = req.body;

    const analysis = careerGapAnalyses.get(gapAnalysisId);

    if (!analysis) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Career gap analysis not found'
      });
    }

    if (!mockHelpers.userOwnsResume(req.user.id, analysis.resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    // Generate mock learning roadmap
    const roadmapId = uuidv4();

    const mockModules: Module[] = [
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
                type: 'documentation'
              },
              {
                title: 'Scalability Lecture - Harvard CS75',
                url: 'https://www.youtube.com/watch?v=-W9F__D3oY4',
                type: 'video'
              }
            ],
            estimatedHours: 5,
            completed: false
          },
          {
            title: 'Database Scaling',
            description: 'Sharding, replication, and CAP theorem',
            links: [
              {
                title: 'Database Scaling Patterns',
                url: 'https://medium.com/system-design-blog/database-scaling-patterns',
                type: 'article'
              }
            ],
            estimatedHours: 4,
            completed: false
          }
        ],
        completed: false
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
                type: 'course'
              }
            ],
            estimatedHours: 6,
            completed: false
          },
          {
            title: 'Consensus Algorithms',
            description: 'Raft, Paxos, and distributed consensus',
            links: [
              {
                title: 'Raft Consensus Algorithm',
                url: 'https://raft.github.io/',
                type: 'documentation'
              }
            ],
            estimatedHours: 5,
            completed: false
          }
        ],
        completed: false
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
                type: 'documentation'
              }
            ],
            estimatedHours: 5,
            completed: false
          },
          {
            title: 'API Gateway and Service Mesh',
            description: 'Understanding Kong, Istio, and service discovery',
            links: [
              {
                title: 'Introduction to Service Mesh',
                url: 'https://www.redhat.com/en/topics/microservices/what-is-a-service-mesh',
                type: 'article'
              }
            ],
            estimatedHours: 4,
            completed: false
          }
        ],
        completed: false
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
                title: 'The Staff Engineer\'s Path',
                url: 'https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/',
                type: 'course'
              }
            ],
            estimatedHours: 4,
            completed: false
          },
          {
            title: 'Mentoring and Code Review',
            description: 'Best practices for guiding other engineers',
            links: [
              {
                title: 'Effective Code Review',
                url: 'https://google.github.io/eng-practices/review/',
                type: 'documentation'
              }
            ],
            estimatedHours: 3,
            completed: false
          }
        ],
        completed: false
      }
    ];

    const roadmap: LearningRoadmap = {
      roadmapId,
      gapAnalysisId,
      timeline: timeline || 30,
      modules: mockModules,
      estimatedTotalHours: 40,
      generatedAt: new Date().toISOString()
    };

    learningRoadmaps.set(roadmapId, roadmap);

    res.json(roadmap);
  },

  // GET /api/learning-roadmap/:roadmapId
  getLearningRoadmap: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    if (req.user.subscriptionTier !== 'pro') {
      return res.status(403).json({
        error: 'forbidden',
        message: 'This feature requires Pro tier subscription'
      });
    }

    const { roadmapId } = req.params;
    const roadmap = learningRoadmaps.get(roadmapId);

    if (!roadmap) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Learning roadmap not found'
      });
    }

    const analysis = careerGapAnalyses.get(roadmap.gapAnalysisId);
    if (!analysis || !mockHelpers.userOwnsResume(req.user.id, analysis.resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    res.json(roadmap);
  },

  // PUT /api/learning-roadmap/:roadmapId/progress
  updateProgress: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    if (req.user.subscriptionTier !== 'pro') {
      return res.status(403).json({
        error: 'forbidden',
        message: 'This feature requires Pro tier subscription'
      });
    }

    const { roadmapId } = req.params;
    const { moduleId, topicId, completed } = req.body;

    const roadmap = learningRoadmaps.get(roadmapId);

    if (!roadmap) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Learning roadmap not found'
      });
    }

    const analysis = careerGapAnalyses.get(roadmap.gapAnalysisId);
    if (!analysis || !mockHelpers.userOwnsResume(req.user.id, analysis.resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    // Update progress
    const module = roadmap.modules.find(m => m.id === moduleId);
    if (module && topicId) {
      const topic = module.topics.find(t => t.title === topicId);
      if (topic) {
        topic.completed = completed;
      }

      // Check if all topics in module are completed
      module.completed = module.topics.every(t => t.completed);
    }

    // Calculate progress
    let completedModules = 0;
    let completedTopics = 0;
    let totalTopics = 0;

    roadmap.modules.forEach(m => {
      if (m.completed) completedModules++;
      m.topics.forEach(t => {
        totalTopics++;
        if (t.completed) completedTopics++;
      });
    });

    res.json({
      success: true,
      progress: {
        completedModules,
        totalModules: roadmap.modules.length,
        completedTopics,
        totalTopics,
        progressPercentage: Math.round((completedTopics / totalTopics) * 100)
      }
    });
  }
};
