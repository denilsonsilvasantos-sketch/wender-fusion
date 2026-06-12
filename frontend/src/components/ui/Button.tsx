import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2'

  const variants = {
    primary: 'bg-[var(--color-primary)] text-black hover:bg-[var(--color-primary-hover)] focus-visible:outline-[var(--color-primary)] shadow-sm hover:shadow-[var(--shadow-glow-primary)]',
    secondary: 'bg-[var(--color-secondary)] text-black hover:bg-[var(--color-secondary-hover)] focus-visible:outline-[var(--color-secondary)]',
    outline: 'border border-[var(--color-border-light)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-transparent',
    ghost: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] bg-transparent',
    danger: 'bg-[var(--color-danger)] text-white hover:bg-red-600 focus-visible:outline-[var(--color-danger)]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
}
