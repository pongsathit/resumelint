import { Request, Response } from 'express';
import { resumeService } from '../services/resumeService';
import { careerService } from '../services/careerService';
import { sendUnauthorized, sendNotFound, sendForbidden } from '../utils/errors';
import { ERROR_MESSAGES } from '../constants/errors';

export const careerController = {
  analyzeCareerGap: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    if (req.user.subscriptionTier !== 'pro') {
      return sendForbidden(res, ERROR_MESSAGES.PRO_REQUIRED);
    }

    const { resumeId, currentRole, targetRole } = req.body;
    const resume = await resumeService.getResumeById(resumeId);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    const analysis = await careerService.createCareerGapAnalysis({
      resumeId,
      currentRole,
      targetRole,
    });

    res.json(analysis);
  },

  getCareerGapAnalysis: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    if (req.user.subscriptionTier !== 'pro') {
      return sendForbidden(res, ERROR_MESSAGES.PRO_REQUIRED);
    }

    const { gapAnalysisId } = req.params;
    const analysis = await careerService.getCareerGapAnalysisById(gapAnalysisId);

    if (!analysis) {
      return sendNotFound(res, ERROR_MESSAGES.CAREER_GAP_ANALYSIS_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, analysis.resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    res.json(analysis);
  },

  createLearningRoadmap: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    if (req.user.subscriptionTier !== 'pro') {
      return sendForbidden(res, ERROR_MESSAGES.PRO_REQUIRED);
    }

    const { gapAnalysisId, timeline } = req.body;
    const analysis = await careerService.getCareerGapAnalysisById(gapAnalysisId);

    if (!analysis) {
      return sendNotFound(res, ERROR_MESSAGES.CAREER_GAP_ANALYSIS_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, analysis.resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    const roadmap = await careerService.createLearningRoadmap({
      gapAnalysisId,
      timeline,
    });

    res.json(roadmap);
  },

  getLearningRoadmap: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    if (req.user.subscriptionTier !== 'pro') {
      return sendForbidden(res, ERROR_MESSAGES.PRO_REQUIRED);
    }

    const { roadmapId } = req.params;
    const roadmap = await careerService.getLearningRoadmapById(roadmapId);

    if (!roadmap) {
      return sendNotFound(res, ERROR_MESSAGES.LEARNING_ROADMAP_NOT_FOUND);
    }

    const analysis = await careerService.getCareerGapAnalysisById(roadmap.gapAnalysisId);
    if (!analysis || !(await resumeService.userOwnsResume(req.user.id, analysis.resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    res.json(roadmap);
  },

  updateProgress: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    if (req.user.subscriptionTier !== 'pro') {
      return sendForbidden(res, ERROR_MESSAGES.PRO_REQUIRED);
    }

    const { roadmapId } = req.params;
    const { moduleId, topicId, completed } = req.body;

    const roadmap = await careerService.getLearningRoadmapById(roadmapId);

    if (!roadmap) {
      return sendNotFound(res, ERROR_MESSAGES.LEARNING_ROADMAP_NOT_FOUND);
    }

    const analysis = await careerService.getCareerGapAnalysisById(roadmap.gapAnalysisId);
    if (!analysis || !(await resumeService.userOwnsResume(req.user.id, analysis.resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    const progress = careerService.updateRoadmapProgress(roadmap, moduleId, topicId, completed);

    res.json({
      success: true,
      progress,
    });
  },
};
