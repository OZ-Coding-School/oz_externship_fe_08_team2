export interface CommentSectionProps {
  postId: number
  commentCount: number
}

/**
 * TODO(댓글): 별도 이슈에서 구현
 * - 댓글 목록 (posts/comments GET)
 * - 댓글 작성 폼 (회원만, posts/comments POST)
 * - 댓글 수정/삭제 (posts/comments PUT/DELETE)
 */
export function CommentSection({ commentCount }: CommentSectionProps) {
  return (
    <section className="mt-10" aria-label="댓글">
      <h2 className="text-text-heading mb-4 text-base font-semibold">
        댓글{' '}
        <span className="text-primary">{commentCount.toLocaleString()}</span>
      </h2>
      <div className="border-border-base bg-bg-muted text-text-muted rounded-lg border border-dashed px-6 py-14 text-center text-sm">
        댓글 영역 (구현 예정)
      </div>
    </section>
  )
}
