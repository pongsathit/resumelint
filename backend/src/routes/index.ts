import { Router } from 'express';
import { authController } from '../controllers/authController';
import { userController } from '../controllers/userController';
import { resumeController } from '../controllers/resumeController';
import { analysisController } from '../controllers/analysisController';
import { matchController } from '../controllers/matchController';
import { rewriteController } from '../controllers/rewriteController';
import { careerController } from '../controllers/careerController';
import { exportController } from '../controllers/exportController';
import { usageController } from '../controllers/usageController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ==================== Authentication Routes ====================
router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);
router.post('/api/auth/refresh', authController.refresh);
router.post('/api/auth/logout', authMiddleware, authController.logout);

// ==================== User Management Routes ====================
router.get('/api/users/me', authMiddleware, userController.getMe);
router.patch('/api/users/me', authMiddleware, userController.updateMe);

// ==================== Resume Management Routes ====================
router.post('/api/resumes', optionalAuthMiddleware, upload.single('file'), resumeController.create);
router.get('/api/resumes', authMiddleware, resumeController.list);
router.get('/api/resumes/:id', authMiddleware, resumeController.getById);
router.delete('/api/resumes/:id', authMiddleware, resumeController.delete);

// ==================== Resume Analysis Routes ====================
router.post('/api/resumes/:id/analyze', authMiddleware, analysisController.analyzeResume);
router.get('/api/resumes/:id/analysis', authMiddleware, analysisController.getLatestAnalysis);
router.get('/api/analyses/:analysisId', authMiddleware, analysisController.getById);

// ==================== Job Description & Matching Routes ====================
router.post('/api/job-descriptions', optionalAuthMiddleware, matchController.createJobDescription);
router.post('/api/resumes/:resumeId/match', authMiddleware, matchController.matchResume);
router.get('/api/resumes/:resumeId/matches', authMiddleware, matchController.getResumeMatches);
router.get('/api/matches/:matchId', authMiddleware, matchController.getMatchById);

// ==================== Resume Rewriting Routes ====================
router.post('/api/resumes/:id/rewrite', authMiddleware, rewriteController.rewriteResume);
router.post('/api/rewrites/:rewriteId/improve', authMiddleware, rewriteController.improveRewrite);
router.put('/api/rewrites/:rewriteId', authMiddleware, rewriteController.updateRewrite);
router.get('/api/resumes/:id/rewrites', authMiddleware, rewriteController.getResumeRewrites);
router.get('/api/rewrites/:rewriteId', authMiddleware, rewriteController.getRewriteById);

// ==================== Career Gap & Learning Roadmap Routes ====================
router.post('/api/career-gap', authMiddleware, careerController.analyzeCareerGap);
router.get('/api/career-gap/:gapAnalysisId', authMiddleware, careerController.getCareerGapAnalysis);
router.post('/api/learning-roadmap', authMiddleware, careerController.createLearningRoadmap);
router.get('/api/learning-roadmap/:roadmapId', authMiddleware, careerController.getLearningRoadmap);
router.put('/api/learning-roadmap/:roadmapId/progress', authMiddleware, careerController.updateProgress);

// ==================== Export Routes ====================
router.post('/api/resumes/:id/export', authMiddleware, exportController.exportResume);

// ==================== Usage & Limits Routes ====================
router.get('/api/usage', authMiddleware, usageController.getUsage);

export default router;
