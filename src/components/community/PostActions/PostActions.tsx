export interface PostActionsProps {
  likeCount: number
  isLiked: boolean
  /** false이면 좋아요 버튼 비활성화 (비회원) */
  isLoggedIn: boolean
  // TODO(좋아요): posts/like — POST /api/v1/posts/{post_id}/like 연동
  onLike: () => void
}

export function PostActions({
  likeCount,
  isLiked,
  isLoggedIn,
  onLike,
}: PostActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 py-6">
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
    </div>
  )
}
