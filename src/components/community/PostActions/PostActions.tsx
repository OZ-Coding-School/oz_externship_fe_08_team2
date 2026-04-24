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
    <div className="border-border-base flex items-center justify-center border-y py-10">
      <button
        type="button"
        onClick={onLike}
        disabled={!isLoggedIn}
        aria-label={isLiked ? '좋아요 취소' : '좋아요'}
        aria-pressed={isLiked}
        className={[
          'flex flex-col items-center gap-2 rounded-2xl border px-10 py-4 transition-colors duration-150 outline-none',
          'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2',
          isLiked
            ? 'border-primary bg-primary-100 text-primary'
            : 'border-border-base text-text-muted hover:border-primary hover:text-primary bg-white',
          !isLoggedIn ? 'cursor-not-allowed opacity-50' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="text-3xl leading-none" aria-hidden="true">
          {isLiked ? '♥' : '♡'}
        </span>
        <span className="text-sm font-medium">
          {likeCount.toLocaleString()}
        </span>
      </button>
    </div>
  )
}
