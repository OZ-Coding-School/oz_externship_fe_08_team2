import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { CommentInput } from '@/components/community/CommentInput'

export interface CommentSectionProps {
  postId: number
  commentCount: number
}

/**
 * TODO(댓글 목록): posts/comments GET — feature/commentList 브랜치
 * TODO(댓글 등록): posts/comments POST — feature/commentSubmit 브랜치
 * TODO(댓글 태그): @ 자동완성 — feature/commentTag 브랜치
 * TODO(댓글 삭제): posts/comments DELETE — feature/commentDelete 브랜치
 */
export function CommentSection({ commentCount }: CommentSectionProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [inputValue, setInputValue] = useState('')

  return (
    <section className="mt-10" aria-label="댓글">
      <h2 className="text-text-heading mb-4 text-base font-semibold">
        댓글{' '}
        <span className="text-primary">{commentCount.toLocaleString()}</span>
      </h2>

      {/* 댓글 입력창 — 로그인 사용자만 */}
      {isAuthenticated && (
        <div className="mb-6">
          <CommentInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={() => {}}
            isSubmitting={false}
            submitError={false}
            onSubmitErrorClose={() => {}}
          />
        </div>
      )}

      {/* TODO(댓글 목록): feature/commentList 브랜치에서 구현 */}
      <div className="border-border-base bg-bg-muted text-text-muted rounded-lg border border-dashed px-6 py-14 text-center text-sm">
        댓글 목록 (구현 예정)
      </div>
    </section>
  )
}
