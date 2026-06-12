import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  action?: ReactNode
  noPadding?: boolean
}

export function Card({ title, action, noPadding, children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm',
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          {title && <h3 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">{title}</h3>}
          {action}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  )
}

export function StatCard({ label, value, icon, trend, className }: {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: { value: number; positive?: boolean }
  className?: string
}) {
  return (
    <Card className={cn('hover:border-[var(--color-border-light)] transition-colors', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{value}</p>
          {trend && (
            <p className={cn('text-xs mt-1', trend.positive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]')}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-[var(--color-surface-elevated)] rounded-lg text-[var(--color-primary)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
