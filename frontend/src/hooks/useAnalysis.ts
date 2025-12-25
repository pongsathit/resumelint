import { useState, useCallback } from 'react';
import {
  api,
  AnalysisResponse,
  Role,
  ApiError,
} from '../services/api';

interface UseAnalysisReturn {
  analysis: AnalysisResponse | null;
  isLoading: boolean;
  error: ApiError | null;
  analyzeResume: (resumeId: string, role?: Role) => Promise<AnalysisResponse>;
  fetchAnalysis: (resumeId: string) => Promise<void>;
  fetchAnalysisById: (analysisId: string) => Promise<void>;
  clearAnalysis: () => void;
  clearError: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const analyzeResume = useCallback(async (resumeId: string, role?: Role): Promise<AnalysisResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.analyzeResume(resumeId, role ? { role } : undefined);
      setAnalysis(result);
      return result;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAnalysis = useCallback(async (resumeId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getLatestAnalysis(resumeId);
      setAnalysis(result);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAnalysisById = useCallback(async (analysisId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getAnalysis(analysisId);
      setAnalysis(result);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analysis,
    isLoading,
    error,
    analyzeResume,
    fetchAnalysis,
    fetchAnalysisById,
    clearAnalysis,
    clearError,
  };
}
