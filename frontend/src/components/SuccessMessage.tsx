interface SuccessMessageProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export default function SuccessMessage({
  title = 'Success',
  message,
  onDismiss,
  className = '',
}: SuccessMessageProps) {
  return (
    <div
      className={`rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <span className="material-symbols-outlined text-xl text-green-600 dark:text-green-400">
            check_circle
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">
            {title}
          </h3>
          <p className="mt-0.5 text-sm text-green-700 dark:text-green-400">
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
