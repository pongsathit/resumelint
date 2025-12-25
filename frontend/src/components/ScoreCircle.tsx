interface ScoreCircleProps {
  score: number
  maxScore?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ScoreCircle({
  score,
  maxScore = 100,
  size = 'md',
  className = ''
}: ScoreCircleProps) {
  const percentage = (score / maxScore) * 100
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const sizeClasses = {
    sm: 'size-32',
    md: 'size-48',
    lg: 'size-56'
  }

  const textSizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-6xl'
  }

  // Determine color based on score
  const getColor = () => {
    if (percentage >= 80) return '#22c55e' // green
    if (percentage >= 60) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          className="text-slate-200 dark:text-slate-700"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
        />
        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke={getColor()}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${textSizeClasses[size]} font-black text-slate-900 dark:text-white tracking-tighter`}>
          {score}
        </span>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">
          / {maxScore}
        </span>
      </div>
    </div>
  )
}
