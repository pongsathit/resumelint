import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  icon?: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'

  const variantStyles = {
    primary: 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/25',
    secondary: 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border hover:border-primary dark:hover:border-primary text-slate-900 dark:text-white',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-surface-border text-slate-700 dark:text-white'
  }

  const sizeStyles = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-6 text-base',
    lg: 'h-12 px-8 text-lg'
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
}
