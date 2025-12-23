import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  className?: string
}

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20',
    error: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10',
    info: 'bg-blue-50 dark:bg-primary/20 text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20',
    neutral: 'bg-slate-100 dark:bg-surface-border text-slate-600 dark:text-slate-300'
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
