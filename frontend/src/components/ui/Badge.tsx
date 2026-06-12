import { cn } from '@/lib/utils'
import { STATUS_LABELS } from '@/lib/utils'

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  children?: React.ReactNode
  variant?: BadgeVariant
  status?: string
  className?: string
}

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  active: 'success',
  completed: 'success',
  received: 'success',
  confirmed: 'success',
  approved: 'success',
  published: 'success',
  in_progress: 'info',
  pending: 'warning',
  sent: 'info',
  overdue: 'danger',
  cancelled: 'danger',
  rejected: 'danger',
  revoked: 'danger',
  draft: 'default',
  archived: 'default',
  expired: 'default',
  urgent: 'danger',
  high: 'warning',
  normal: 'default',
  low: 'info',
  refunded: 'warning',
}

export function Badge({ children, variant = 'default', status, className }: BadgeProps) {
  const resolvedVariant = status ? (STATUS_VARIANTS[status] ?? 'default') : variant
  const label = status ? (STATUS_LABELS[status] ?? status) : children

  const variants: Record<BadgeVariant, string> = {
    default: 'bg-[var(--color-surface-high)] text-[var(--color-metal)]',
    primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
    secondary: 'bg-[var(--color-secondary-light)] text-[var(--color-secondary)]',
    success: 'bg-green-500/10 text-green-400',
    warning: 'bg-amber-500/10 text-amber-400',
    danger: 'bg-red-500/10 text-red-400',
    info: 'bg-blue-500/10 text-blue-400',
  }

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', variants[resolvedVariant], className)}>
      {label}
    </span>
  )
}
