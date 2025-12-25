import { useState, useCallback } from 'react';
import {
  api,
  Resume,
  ResumeListResponse,
  Role,
  ApiError,
} from '../services/api';

interface UseResumeReturn {
  resume: Resume | null;
  resumes: ResumeListResponse | null;
  isLoading: boolean;
  error: ApiError | null;
  uploadResume: (file: File | null, text: string | null, role: Role) => Promise<Resume>;
  fetchResume: (id: string) => Promise<void>;
  fetchResumes: (page?: number, limit?: number) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useResume(): UseResumeReturn {
  const [resume, setResume] = useState<Resume | null>(null);
  const [resumes, setResumes] = useState<ResumeListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const uploadResume = useCallback(async (file: File | null, text: string | null, role: Role): Promise<Resume> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.createResume(file, text, role);
      setResume(result);
      return result;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchResume = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getResume(id);
      setResume(result);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchResumes = useCallback(async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.listResumes(page, limit);
      setResumes(result);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteResume = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.deleteResume(id);
      // Remove from local state
      if (resumes) {
        setResumes({
          ...resumes,
          resumes: resumes.resumes.filter((r) => r.id !== id),
        });
      }
      if (resume?.id === id) {
        setResume(null);
      }
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [resume, resumes]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    resume,
    resumes,
    isLoading,
    error,
    uploadResume,
    fetchResume,
    fetchResumes,
    deleteResume,
    clearError,
  };
}
