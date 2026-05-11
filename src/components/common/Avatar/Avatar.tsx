import { useState } from 'react'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string | null
  alt: string
  size?: AvatarSize
  /** Fallback single character (auto-derived from alt if omitted) */
  initials?: string
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

function deriveInitials(alt: string, initials?: string): string {
  if (initials) return initials.slice(0, 2).toUpperCase()
  const words = alt.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export function Avatar({
  src,
  alt,
  size = 'md',
  initials,
  className = '',
}: AvatarProps) {
  const letters = deriveInitials(alt, initials)
  const [imgError, setImgError] = useState(false)
  const showImage = src && !imgError

  return (
    <span
      role="img"
      aria-label={alt}
      className={[
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold select-none',
        sizeClasses[size],
        !showImage ? 'bg-primary-100 text-primary-700' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden="true">{letters}</span>
      )}
    </span>
  )
}

export default Avatar
