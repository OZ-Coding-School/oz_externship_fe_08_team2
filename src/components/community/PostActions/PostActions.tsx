import { useState } from 'react'

export interface PostActionsProps {
  likeCount: number
  isLiked: boolean
  /** false이면 좋아요 버튼 비활성화 (비회원) */
  isLoggedIn: boolean
  // TODO(좋아요): posts/like — POST /api/v1/posts/{post_id}/like 연동
  onLike: () => void
  onShare: () => Promise<void>
}

export function PostActions({
  likeCount,
  isLiked,
  isLoggedIn,
  onLike,
  onShare,
}: PostActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    await onShare()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-end gap-3 py-6">
      {/* 좋아요 버튼 */}
      <button
        type="button"
        onClick={onLike}
        disabled={!isLoggedIn}
        aria-label={isLiked ? '좋아요 취소' : '좋아요'}
        aria-pressed={isLiked}
        className={[
          'flex items-center gap-1 rounded-full border px-4 py-2.5 text-xs transition-colors duration-150 outline-none',
          'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2',
          isLiked
            ? 'border-primary bg-primary-50 text-primary'
            : 'hover:border-primary hover:text-primary border-gray-300 text-gray-500',
          !isLoggedIn ? 'cursor-not-allowed opacity-50' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        <span className="font-normal">{likeCount.toLocaleString()}</span>
      </button>

      {/* 공유 버튼 */}
      <button
        type="button"
        onClick={handleShare}
        aria-label="게시글 링크 복사"
        className="border-border-base text-text-body hover:text-text-heading flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm transition-colors duration-150 outline-none hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span className="font-medium">{copied ? '복사됨!' : '공유하기'}</span>
      </button>
    </div>
  )
}
