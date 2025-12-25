export const ERROR_CODES = {
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  VALIDATION_ERROR: 'validation_error',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  INTERNAL_ERROR: 'internal_error',
} as const;

export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'Authentication required',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_CREDENTIALS: 'Invalid credentials',
  FORBIDDEN_ACCESS: 'You do not have permission to access this resource',
  USER_NOT_FOUND: 'User not found',
  RESUME_NOT_FOUND: 'Resume not found',
  ANALYSIS_NOT_FOUND: 'Analysis not found',
  MATCH_NOT_FOUND: 'Match not found',
  REWRITE_NOT_FOUND: 'Rewrite not found',
  JOB_DESCRIPTION_NOT_FOUND: 'Job description not found',
  CAREER_GAP_ANALYSIS_NOT_FOUND: 'Career gap analysis not found',
  LEARNING_ROADMAP_NOT_FOUND: 'Learning roadmap not found',
  NO_ANALYSIS_FOUND: 'No analysis found for this resume',
  RATE_LIMIT: 'Usage limit reached. Please upgrade to Pro.',
  PRO_REQUIRED: 'This feature requires Pro tier subscription',
} as const;
