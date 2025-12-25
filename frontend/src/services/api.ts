// API Client Configuration and Base Functions
// Matches API_DESIGN.md specifications exactly

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ==================== Types matching API_DESIGN.md ====================

export type Provider = 'google' | 'github' | 'email';
export type SubscriptionTier = 'free' | 'pro';
export type Role = 'Backend Engineer' | 'Frontend Engineer' | 'Fullstack Developer' | 'Mobile Developer' | 'Tech Lead';
export type Section = 'experience' | 'skills' | 'projects' | 'summary';
export type Severity = 'critical' | 'warning' | 'info';
export type Importance = 'high' | 'medium' | 'low';
export type MatchStrength = 'high' | 'medium' | 'low';
export type Focus = 'impact' | 'metrics' | 'seniority' | 'ats';
export type ExportType = 'resume' | 'analysis' | 'match' | 'rewrite';
export type ResumeStatus = 'parsed' | 'processing' | 'error';

// ==================== Request/Response Types ====================

// Auth
export interface LoginRequest {
  provider: Provider;
  code?: string;
  email?: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
}

// User
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  subscriptionTier: SubscriptionTier;
  defaultRole?: Role;
  usageCount: {
    analyses: number;
    matches: number;
    rewrites: number;
  };
  limits: {
    maxAnalyses: number;
    maxMatches: number;
    maxRewrites: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  name?: string;
  defaultRole?: Role;
}

export interface UpdateUserResponse {
  id: string;
  email: string;
  name: string;
  defaultRole?: string;
  updatedAt: string;
}

// Resume
export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  rawText: string;
  parsedSections: {
    contact?: Record<string, unknown>;
    experience?: Array<Record<string, unknown>>;
    education?: Array<Record<string, unknown>>;
    skills?: string[];
    projects?: Array<Record<string, unknown>>;
  };
  role: Role;
  createdAt: string;
  updatedAt: string;
  status: ResumeStatus;
}

export interface ResumeListItem {
  id: string;
  fileName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  hasAnalysis: boolean;
  hasMatch: boolean;
}

export interface ResumeListResponse {
  resumes: ResumeListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DeleteResumeResponse {
  success: boolean;
  message: string;
}

// Analysis
export interface Suggestion {
  id: string;
  section: Section;
  severity: Severity;
  title: string;
  description: string;
  originalText: string;
  suggestedText: string;
  reasoning: string;
}

export interface AnalysisResponse {
  analysisId: string;
  resumeId: string;
  scores: {
    overall: number;
    clarity: number;
    impact: number;
    atsFriendliness: number;
    technicalDepth: number;
  };
  suggestions: Suggestion[];
  summary: string;
  generatedAt: string;
}

export interface AnalyzeRequest {
  role?: Role;
}

// Job Description
export interface JobDescription {
  id: string;
  rawText: string;
  title: string;
  company: string;
  createdAt: string;
}

export interface CreateJobDescriptionRequest {
  rawText: string;
  title?: string;
  company?: string;
}

// Match
export interface MissingKeyword {
  keyword: string;
  importance: Importance;
  frequency: number;
}

export interface Strength {
  keyword: string;
  matchStrength: MatchStrength;
  context: string;
}

export interface MatchResponse {
  matchId: string;
  resumeId: string;
  jobDescriptionId: string;
  matchScore: number;
  breakdown: {
    keywords: number;
    experience: number;
    skills: number;
    education: number;
  };
  missingKeywords: MissingKeyword[];
  strengths: Strength[];
  aiExplanation: {
    summary: string;
    whyMismatch: string;
    priorityChanges: string[];
    improvementTips: string[];
  };
  generatedAt: string;
}

export interface MatchRequest {
  jobDescriptionId?: string;
  jobDescriptionText?: string;
}

export interface MatchListItem {
  matchId: string;
  jobDescriptionId: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  createdAt: string;
}

export interface MatchListResponse {
  matches: MatchListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Rewrite
export interface Change {
  section: string;
  originalBullet: string;
  rewrittenBullet: string;
  improvements: string[];
  explanation: string;
}

export interface RewriteResponse {
  rewriteId: string;
  resumeId: string;
  originalText: string;
  rewrittenText: string;
  changes: Change[];
  scoreImprovement: {
    before: number;
    after: number;
    delta: number;
  };
  generatedAt: string;
}

export interface RewriteRequest {
  sections?: Section[];
  focus?: Focus;
  jobDescriptionId?: string;
}

export interface ImproveRewriteRequest {
  prompt: string;
  section: Section;
  bulletIndex: number;
}

export interface ImproveRewriteResponse {
  rewrittenBullet: string;
  explanation: string;
  improvements: string[];
}

export interface UpdateRewriteRequest {
  rewrittenText: string;
  changes?: Change[];
}

export interface UpdateRewriteResponse {
  rewriteId: string;
  savedAt: string;
  version: number;
}

export interface RewriteListItem {
  rewriteId: string;
  version: number;
  scoreImprovement: number;
  createdAt: string;
  updatedAt: string;
}

export interface RewriteListResponse {
  rewrites: RewriteListItem[];
}

// Usage
export interface UsageResponse {
  tier: SubscriptionTier;
  usage: {
    analyses: {
      used: number;
      limit: number;
      resetAt: string;
    };
    matches: {
      used: number;
      limit: number;
      resetAt: string;
    };
    rewrites: {
      used: number;
      limit: number;
      resetAt: string;
    };
  };
  canAnalyze: boolean;
  canMatch: boolean;
  canRewrite: boolean;
}

// Error Response
export interface ApiError {
  error: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  retryAfter?: number;
}

// ==================== API Client Class ====================

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    this.accessToken = null;
    this.refreshToken = null;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    options: {
      body?: unknown;
      formData?: FormData;
      requiresAuth?: boolean;
    } = {}
  ): Promise<T> {
    const { body, formData, requiresAuth = false } = options;

    const headers: Record<string, string> = {};

    if (requiresAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    if (body && !formData) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      headers,
      body: formData ? formData : body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    // Handle token refresh on 401
    if (response.status === 401 && this.refreshToken && requiresAuth) {
      const refreshed = await this.tryRefreshToken();
      if (refreshed) {
        // Retry the request with new token
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
          ...config,
          headers,
        });

        if (!retryResponse.ok) {
          const error = await retryResponse.json();
          throw error as ApiError;
        }

        return retryResponse.json();
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw error as ApiError;
    }

    // Handle binary responses (PDF export)
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/pdf')) {
      return response.blob() as unknown as T;
    }

    return response.json();
  }

  private async tryRefreshToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data: RefreshResponse = await response.json();
      this.saveTokensToStorage(data.accessToken, data.refreshToken);
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  // ==================== Auth Endpoints ====================

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('POST', '/api/auth/login', {
      body: request,
    });
    this.saveTokensToStorage(response.accessToken, response.refreshToken);
    return response;
  }

  async refresh(): Promise<RefreshResponse> {
    if (!this.refreshToken) {
      throw { error: 'no_token', message: 'No refresh token available' } as ApiError;
    }
    const response = await this.request<RefreshResponse>('POST', '/api/auth/refresh', {
      body: { refreshToken: this.refreshToken },
    });
    this.saveTokensToStorage(response.accessToken, response.refreshToken);
    return response;
  }

  async logout(): Promise<LogoutResponse> {
    const response = await this.request<LogoutResponse>('POST', '/api/auth/logout', {
      requiresAuth: true,
    });
    this.clearTokens();
    return response;
  }

  // ==================== User Endpoints ====================

  async getMe(): Promise<User> {
    return this.request<User>('GET', '/api/users/me', { requiresAuth: true });
  }

  async updateMe(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    return this.request<UpdateUserResponse>('PATCH', '/api/users/me', {
      body: request,
      requiresAuth: true,
    });
  }

  // ==================== Resume Endpoints ====================

  async createResume(file: File | null, text: string | null, role: Role): Promise<Resume> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (text) {
      formData.append('text', text);
    }
    formData.append('role', role);

    return this.request<Resume>('POST', '/api/resumes', {
      formData,
      requiresAuth: true,
    });
  }

  async listResumes(page = 1, limit = 20): Promise<ResumeListResponse> {
    return this.request<ResumeListResponse>('GET', `/api/resumes?page=${page}&limit=${limit}`, {
      requiresAuth: true,
    });
  }

  async getResume(id: string): Promise<Resume> {
    return this.request<Resume>('GET', `/api/resumes/${id}`, { requiresAuth: true });
  }

  async deleteResume(id: string): Promise<DeleteResumeResponse> {
    return this.request<DeleteResumeResponse>('DELETE', `/api/resumes/${id}`, {
      requiresAuth: true,
    });
  }

  // ==================== Analysis Endpoints ====================

  async analyzeResume(resumeId: string, request?: AnalyzeRequest): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>('POST', `/api/resumes/${resumeId}/analyze`, {
      body: request || {},
      requiresAuth: true,
    });
  }

  async getLatestAnalysis(resumeId: string): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>('GET', `/api/resumes/${resumeId}/analysis`, {
      requiresAuth: true,
    });
  }

  async getAnalysis(analysisId: string): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>('GET', `/api/analyses/${analysisId}`, {
      requiresAuth: true,
    });
  }

  // ==================== Job Description & Match Endpoints ====================

  async createJobDescription(request: CreateJobDescriptionRequest): Promise<JobDescription> {
    return this.request<JobDescription>('POST', '/api/job-descriptions', {
      body: request,
      requiresAuth: true,
    });
  }

  async matchResume(resumeId: string, request: MatchRequest): Promise<MatchResponse> {
    return this.request<MatchResponse>('POST', `/api/resumes/${resumeId}/match`, {
      body: request,
      requiresAuth: true,
    });
  }

  async getResumeMatches(resumeId: string, page = 1, limit = 20): Promise<MatchListResponse> {
    return this.request<MatchListResponse>(
      'GET',
      `/api/resumes/${resumeId}/matches?page=${page}&limit=${limit}`,
      { requiresAuth: true }
    );
  }

  async getMatch(matchId: string): Promise<MatchResponse> {
    return this.request<MatchResponse>('GET', `/api/matches/${matchId}`, {
      requiresAuth: true,
    });
  }

  // ==================== Rewrite Endpoints ====================

  async rewriteResume(resumeId: string, request?: RewriteRequest): Promise<RewriteResponse> {
    return this.request<RewriteResponse>('POST', `/api/resumes/${resumeId}/rewrite`, {
      body: request || {},
      requiresAuth: true,
    });
  }

  async improveRewrite(
    rewriteId: string,
    request: ImproveRewriteRequest
  ): Promise<ImproveRewriteResponse> {
    return this.request<ImproveRewriteResponse>('POST', `/api/rewrites/${rewriteId}/improve`, {
      body: request,
      requiresAuth: true,
    });
  }

  async updateRewrite(
    rewriteId: string,
    request: UpdateRewriteRequest
  ): Promise<UpdateRewriteResponse> {
    return this.request<UpdateRewriteResponse>('PUT', `/api/rewrites/${rewriteId}`, {
      body: request,
      requiresAuth: true,
    });
  }

  async getResumeRewrites(resumeId: string): Promise<RewriteListResponse> {
    return this.request<RewriteListResponse>('GET', `/api/resumes/${resumeId}/rewrites`, {
      requiresAuth: true,
    });
  }

  async getRewrite(rewriteId: string): Promise<RewriteResponse> {
    return this.request<RewriteResponse>('GET', `/api/rewrites/${rewriteId}`, {
      requiresAuth: true,
    });
  }

  // ==================== Export Endpoints ====================

  async exportResume(
    resumeId: string,
    type: ExportType,
    rewriteId?: string,
    matchId?: string
  ): Promise<Blob> {
    const body: Record<string, string> = { type, format: 'pdf' };
    if (rewriteId) body.rewriteId = rewriteId;
    if (matchId) body.matchId = matchId;

    return this.request<Blob>('POST', `/api/resumes/${resumeId}/export`, {
      body,
      requiresAuth: true,
    });
  }

  // ==================== Usage Endpoints ====================

  async getUsage(): Promise<UsageResponse> {
    return this.request<UsageResponse>('GET', '/api/usage', { requiresAuth: true });
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export class for testing
export { ApiClient };
