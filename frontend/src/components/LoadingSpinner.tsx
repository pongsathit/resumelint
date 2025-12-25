interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export default function LoadingSpinner({
  size = 'md',
  className = '',
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'size-5',
    md: 'size-8',
    lg: 'size-12',
  };

  const borderSizes = {
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} ${borderSizes[size]} border-primary/30 border-t-primary rounded-full animate-spin`}
      />
      {message && (
        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
