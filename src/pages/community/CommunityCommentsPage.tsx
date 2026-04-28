import { useEffect, useRef, useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { Avatar, Toast } from '@/components'
import {
  useCommentsInfiniteQuery,
  useSubmitComment,
} from '@/features/posts/comments'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/routes'
import type { Comment, TaggedUser } from '@/features/posts/comments'

// ─── 날짜 포맷 ────────────────────────────────────────────
function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString))
}

// ─── @멘션 파싱 ───────────────────────────────────────────
function parseContent(
  content: string,
  taggedUsers: TaggedUser[]
): React.ReactNode[] {
  const mentionRegex = /@(\S+)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = mentionRegex.exec(content)) !== null) {
    const nickname = match[1]
    const isTagged = taggedUsers.some((u) => u.nickname === nickname)

    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index))
    }

    parts.push(
      <span
        key={match.index}
        className={isTagged ? 'text-primary font-bold' : ''}
      >
        {match[0]}
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex))
  }

  return parts
}

// ─── 댓글 단일 아이템 ─────────────────────────────────────
function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3 border-b border-gray-200 py-4">
      <Avatar
        src={comment.author.profile_img_url}
        alt={comment.author.nickname}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-text-heading text-sm font-semibold">
            {comment.author.nickname}
          </span>
          <span className="text-text-muted text-xs">
            {formatDate(comment.created_at)}
          </span>
        </div>
        <p className="text-text-body text-sm leading-relaxed break-words">
          {parseContent(comment.content, comment.tagged_users)}
        </p>
      </div>
    </div>
  )
}

// ─── 메인 컴포넌트 ────────────────────────────────────────
/**
 * 댓글 목록 컴포넌트
 *
 * 사용법 (CommunityDetailPage에서):
 *   import { CommunityCommentsPage } from '@/pages/community/CommunityCommentsPage'
 *   <CommunityCommentsPage postId={post.id} />
 */
interface Props {
  postId: number
}

export function CommunityCommentsPage({ postId }: Props) {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [submitToast, setSubmitToast] = useState<{
    message: string
    variant: 'success' | 'error'
    visible: boolean
  }>({ message: '', variant: 'error', visible: false })

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useCommentsInfiniteQuery(postId, Boolean(postId))

  const { mutate: submitComment, isPending: isSubmitting } =
    useSubmitComment(postId)

  const showSubmitToast = useCallback(
    (message: string, variant: 'success' | 'error' = 'error') => {
      setSubmitToast({ message, variant, visible: true })
    },
    []
  )

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return
    submitComment(
      { content: inputValue.trim() },
      {
        onSuccess: () => setInputValue(''),
        onError: (err) => {
          if (!axios.isAxiosError(err)) {
            showSubmitToast('요청에 실패했습니다. 잠시 후 다시 시도해주세요.')
            return
          }
          const status = err.response?.status
          if (status === 400) {
            showSubmitToast('댓글 내용을 입력해주세요.')
          } else if (status === 401) {
            showSubmitToast('로그인이 필요합니다.')
          } else if (status === 404) {
            showSubmitToast('존재하지 않는 게시글입니다.')
            navigate(ROUTES.COMMUNITY.LIST, { replace: true })
          } else {
            showSubmitToast('요청에 실패했습니다. 잠시 후 다시 시도해주세요.')
          }
        },
      }
    )
  }, [inputValue, submitComment, showSubmitToast, navigate])

  // 게시물이 삭제된 경우 (404) 여부를 쿼리 상태에서 직접 파생
  const isPostNotFound =
    isError && axios.isAxiosError(error) && error.response?.status === 404

  const handleToastClose = useCallback(() => {
    navigate(ROUTES.COMMUNITY.LIST, { replace: true })
  }, [navigate])

  // 무한스크롤 IntersectionObserver
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // ── 조기 반환 (hooks 이후) ──────────────────────────────

  const allComments = data?.pages.flatMap((page) => page.results) ?? []
  const totalCount = data?.pages[0]?.count ?? 0

  // 초기 로딩
  if (isLoading) {
    return (
      <section className="mt-8">
        <div className="text-primary py-8 text-center text-8xl">...</div>
      </section>
    )
  }

  return (
    <section className="mt-8">
      {/* 게시물 조회 404 토스트 — 닫히면 목록 페이지로 이동 */}
      <Toast
        message="해당 게시물은 없습니다."
        variant="error"
        visible={isPostNotFound}
        onClose={handleToastClose}
      />

      {/* 댓글 작성 에러 토스트 */}
      <Toast
        message={submitToast.message}
        variant={submitToast.variant}
        visible={submitToast.visible}
        onClose={() => setSubmitToast((prev) => ({ ...prev, visible: false }))}
      />

      {/* 헤더 */}
      <h2 className="text-text-heading mb-4 text-lg font-semibold">
        댓글 {totalCount}개
      </h2>

      {/* 댓글 입력창 — 로그인 사용자만 */}
      {isAuthenticated && (
        <div className="mb-6 flex gap-3">
          <Avatar
            src={user?.profileImage ?? null}
            alt={user?.nickname ?? ''}
            size="sm"
          />
          <div className="flex flex-1 flex-col gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
              maxLength={500}
              disabled={isSubmitting}
              className="border-border-base bg-bg-base text-text-heading placeholder:text-text-muted focus:border-primary w-full resize-none rounded-sm border px-4 py-3 text-sm transition-colors duration-150 outline-none disabled:opacity-50"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isSubmitting}
                className="bg-primary text-text-inverse hover:bg-primary-700 rounded-sm px-5 py-2 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? '등록 중...' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 댓글 목록 */}
      {allComments.length === 0 ? (
        <p className="text-text-muted py-8 text-center">
          등록된 댓글이 없습니다.
        </p>
      ) : (
        <div>
          {allComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {/* 무한스크롤 감지 영역 + 로딩 표시 */}
      <div ref={loadMoreRef} className="py-2">
        {isFetchingNextPage && (
          <div className="text-primary py-4 text-center text-8xl">...</div>
        )}
      </div>
    </section>
  )
}
