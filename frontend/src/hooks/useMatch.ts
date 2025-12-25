import { useState, useCallback } from 'react';
import {
  api,
  MatchResponse,
  MatchListResponse,
  JobDescription,
  CreateJobDescriptionRequest,
  ApiError,
} from '../services/api';

interface UseMatchReturn {
  match: MatchResponse | null;
  matches: MatchListResponse | null;
  jobDescription: JobDescription | null;
  isLoading: boolean;
  error: ApiError | null;
  createJobDescription: (request: CreateJobDescriptionRequest) => Promise<JobDescription>;
  matchResume: (resumeId: string, jobDescriptionId?: string, jobDescriptionText?: string) => Promise<MatchResponse>;
  fetchMatch: (matchId: string) => Promise<void>;
  fetchMatches: (resumeId: string, page?: number, limit?: number) => Promise<void>;
  clearMatch: () => void;
  clearError: () => void;
}

export function useMatch(): UseMatchReturn {
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [matches, setMatches] = useState<MatchListResponse | null>(null);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createJobDescription = useCallback(async (request: CreateJobDescriptionRequest): Promise<JobDescription> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.createJobDescription(request);
      setJobDescription(result);
      return result;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const matchResume = useCallback(async (
    resumeId: string,
    jobDescriptionId?: string,
    jobDescriptionText?: string
  ): Promise<MatchResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const request: { jobDescriptionId?: string; jobDescriptionText?: string } = {};
      if (jobDescriptionId) {
        request.jobDescriptionId = jobDescriptionId;
      }
      if (jobDescriptionText) {
        request.jobDescriptionText = jobDescriptionText;
      }

      const result = await api.matchResume(resumeId, request);
      setMatch(result);
      return result;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMatch = useCallback(async (matchId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getMatch(matchId);
      setMatch(result);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMatches = useCallback(async (resumeId: string, page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getResumeMatches(resumeId, page, limit);
      setMatches(result);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMatch = useCallback(() => {
    setMatch(null);
    setJobDescription(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    match,
    matches,
    jobDescription,
    isLoading,
    error,
    createJobDescription,
    matchResume,
    fetchMatch,
    fetchMatches,
    clearMatch,
    clearError,
  };
}
