import { Role, Provider, ExportType } from '../types';

export const VALID_ROLES: Role[] = [
  'Backend Engineer',
  'Frontend Engineer',
  'Fullstack Developer',
  'Mobile Developer',
  'Tech Lead'
];

export const VALID_PROVIDERS: Provider[] = ['google', 'github', 'email'];

export const VALID_EXPORT_TYPES: ExportType[] = ['resume', 'analysis', 'match', 'rewrite'];

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
} as const;

export const RATE_LIMIT = {
  RETRY_AFTER: 86400,
} as const;
