import { Role, Provider, ExportType } from '../types';
import { VALID_ROLES, VALID_PROVIDERS, VALID_EXPORT_TYPES } from '../constants/validation';

interface ValidationDetail {
  field: string;
  message: string;
}

export const validateRole = (role: any): { isValid: boolean; details?: ValidationDetail[] } => {
  if (!role || !VALID_ROLES.includes(role as Role)) {
    return {
      isValid: false,
      details: [{ field: 'role', message: 'Invalid role value' }],
    };
  }
  return { isValid: true };
};

export const validateProvider = (provider: any): { isValid: boolean; details?: ValidationDetail[] } => {
  if (!VALID_PROVIDERS.includes(provider as Provider)) {
    return {
      isValid: false,
      details: [{ field: 'provider', message: 'Provider must be google, github, or email' }],
    };
  }
  return { isValid: true };
};

export const validateExportType = (type: any): { isValid: boolean; details?: ValidationDetail[] } => {
  if (!VALID_EXPORT_TYPES.includes(type as ExportType)) {
    return {
      isValid: false,
      details: [{ field: 'type', message: 'Type must be resume, analysis, match, or rewrite' }],
    };
  }
  return { isValid: true };
};

export const validateRequired = (value: any, fieldName: string): { isValid: boolean; details?: ValidationDetail[] } => {
  if (!value) {
    return {
      isValid: false,
      details: [{ field: fieldName, message: `${fieldName} is required` }],
    };
  }
  return { isValid: true };
};
