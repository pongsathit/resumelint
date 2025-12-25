import { useState, useCallback } from 'react';
import {
  api,
  RewriteResponse,
  RewriteListResponse,
  RewriteRequest,
  ImproveRewriteRequest,
  ImproveRewriteResponse,
  ApiError,
} from '../services/api';

interface UseRewriteReturn {
  rewrite: RewriteResponse | null;
  rewrites: RewriteListResponse | null;
  improvedBullet: ImproveRewriteResponse | null;
  isLoading: boolean;
  error: ApiError | null;
  rewriteResume: (resumeId: string, request?: RewriteRequest) => Promise<RewriteResponse>;
  improveRewrite: (rewriteId: string, request: ImproveRewriteRequest) => Promise<ImproveRewriteResponse>;
  updateRewrite: (rewriteId: string, rewrittenText: string) => Promise<void>;
  fetchRewrite: (rewriteId: string) => Promise<void>;
  fetchRewrites: (resumeId: string) => Promise<void>;
  clearRewrite: () => void;
  clearError: () => void;
}

export function useRewrite(): UseRewriteReturn {
  const [rewrite, setRewrite] = useState<RewriteResponse | null>(null);
  const [rewrites, setRewrites] = useState<RewriteListResponse | null>(null);
  const [improvedBullet, setImprovedBullet] = useState<ImproveRewriteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const rewriteResume = useCallback(async (resumeId: string, request?: RewriteRequest): Promise<RewriteResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.rewriteResume(resumeId, request);
      setRewrite(result);
      return result;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const improveRewrite = useCallback(async (
    rewriteId: string,
    request: ImproveRewriteRequest
  ): Promise<ImproveRewriteResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.improveRewrite(rewriteId, request);
      setImprovedBullet(result);
      return result;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRewrite = useCallback(async (rewriteId: string, rewrittenText: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.updateRewrite(rewriteId, { rewrittenText });
      // Update local state with new version
      if (rewrite) {
        setRewrite({
          ...rewrite,
          rewrittenText,
        });
      }
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [rewrite]);

  const fetchRewrite = useCallback(async (rewriteId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getRewrite(rewriteId);
      setRewrite(result);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRewrites = useCallback(async (resumeId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getResumeRewrites(resumeId);
      setRewrites(result);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRewrite = useCallback(() => {
    setRewrite(null);
    setImprovedBullet(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    rewrite,
    rewrites,
    improvedBullet,
    isLoading,
    error,
    rewriteResume,
    improveRewrite,
    updateRewrite,
    fetchRewrite,
    fetchRewrites,
    clearRewrite,
    clearError,
  };
}
