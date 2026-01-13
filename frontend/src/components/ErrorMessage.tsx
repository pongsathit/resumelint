import { ApiError } from '../services/api';
import Button from './Button';

interface ErrorMessageProps {
  error: ApiError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorMessage({
  error,
  onRetry,
  onDismiss,
  className = '',
}: ErrorMessageProps) {
  if (!error) return null;

  const getErrorTitle = () => {
    switch (error.error) {
      case 'unauthorized':
        return 'Authentication Required';
      case 'forbidden':
        return 'Access Denied';
      case 'not_found':
        return 'Not Found';
      case 'validation_error':
        return 'Validation Error';
      case 'rate_limit_exceeded':
        return 'Rate Limit Exceeded';
      case 'ai_service_unavailable':
        return 'AI Service Unavailable';
      case 'internal_error':
        return 'Server Error';
      default:
        return 'Error';
    }
  };

  const getErrorIcon = () => {
    switch (error.error) {
      case 'unauthorized':
      case 'forbidden':
        return 'lock';
      case 'not_found':
        return 'search_off';
      case 'validation_error':
        return 'warning';
      case 'rate_limit_exceeded':
        return 'hourglass_empty';
      case 'ai_service_unavailable':
        return 'cloud_off';
      case 'internal_error':
        return 'error';
      default:
        return 'error_outline';
    }
  };

  return (
    <div
      className={`rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <span className="material-symbols-outlined text-2xl text-red-600 dark:text-red-400">
            {getErrorIcon()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-red-800 dark:text-red-300">
            {getErrorTitle()}
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            {error.message}
          </p>
          {error.details && error.details.length > 0 && (
            <ul className="mt-2 list-disc list-inside space-y-1">
              {error.details.map((detail, index) => (
                <li key={index} className="text-sm text-red-600 dark:text-red-400">
                  <span className="font-medium">{detail.field}:</span> {detail.message}
                </li>
              ))}
            </ul>
          )}
          {error.retryAfter && (
            <p className="mt-2 text-xs text-red-500 dark:text-red-500">
              Try again in {Math.ceil(error.retryAfter / 60)} minutes
            </p>
          )}
          <div className="mt-4 flex gap-3">
            {onRetry && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onRetry}
                icon={<span className="material-symbols-outlined text-[18px]">refresh</span>}
              >
                Try Again
              </Button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
