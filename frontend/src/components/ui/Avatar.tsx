import { cn, getInitials } from '@/lib/utils'
import { getAvatarUrl } from '@/lib/cloudinary'

interface AvatarProps {
  name: string
  avatarUrl?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ name, avatarUrl, size = 'md', className }: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }
  const pixelSizes = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 }

  const imageUrl = avatarUrl ? getAvatarUrl(avatarUrl, pixelSizes[size] * 2) : null

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn('rounded-full object-cover bg-[var(--color-surface-elevated)]', sizes[size], className)}
      />
    )
  }

  return (
    <div className={cn('rounded-full bg-[var(--color-primary)] flex items-center justify-center font-semibold text-black', sizes[size], className)}>
      {getInitials(name)}
    </div>
  )
}
