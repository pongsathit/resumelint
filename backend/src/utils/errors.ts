import { Response } from 'express';
import { ERROR_CODES } from '../constants/errors';

interface ValidationDetail {
  field: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: ValidationDetail[]
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: ValidationDetail[],
  retryAfter?: number
) => {
  const response: any = {
    error: code,
    message,
  };

  if (details) {
    response.details = details;
  }

  if (retryAfter) {
    response.retryAfter = retryAfter;
  }

  res.status(statusCode).json(response);
};

export const sendUnauthorized = (res: Response, message: string) => {
  sendError(res, 401, ERROR_CODES.UNAUTHORIZED, message);
};

export const sendForbidden = (res: Response, message: string) => {
  sendError(res, 403, ERROR_CODES.FORBIDDEN, message);
};

export const sendNotFound = (res: Response, message: string) => {
  sendError(res, 404, ERROR_CODES.NOT_FOUND, message);
};

export const sendValidationError = (res: Response, message: string, details?: ValidationDetail[]) => {
  sendError(res, 400, ERROR_CODES.VALIDATION_ERROR, message, details);
};

export const sendRateLimitError = (res: Response, message: string, retryAfter: number) => {
  sendError(res, 429, ERROR_CODES.RATE_LIMIT_EXCEEDED, message, undefined, retryAfter);
};
