/**
 * @figma 커뮤니티 상세 페이지 (비회원)     https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-10472&m=dev
 * @figma 커뮤니티 상세 페이지 (회원)        https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-10585&m=dev
 * @figma 커뮤니티 상세 페이지 (회원-작성자) https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-10696&m=dev
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ConfirmModal } from '@/components/common/Modal/ConfirmModal'
import { PostHeader } from '@/components/community/PostHeader'
import { PostAuthorActions } from '@/components/community/PostAuthorActions'
import { PostBody } from '@/components/community/PostBody'
import { PostActions } from '@/components/community/PostActions'
import { CommentSection } from '@/components/community/CommentSection'

// TODO(타입): src/features/posts/detail/types.ts 로 이동
interface PostAuthor {
  id: number
  nickname: string
  profileImage: string | null
}

interface PostDetail {
  id: number
  title: string
  /** HTML 문자열 (리치텍스트 에디터 출력, 이미지 포함 가능) */
  content: string
  category: string
  createdAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  isLiked: boolean
  /** TODO(권한): API 응답 필드 vs authStore.userId 비교 — 방식 확정 후 교체 */
  isAuthor: boolean
  author: PostAuthor
}

// TODO(API): posts/detail — GET /api/v1/posts/{post_id} 연동 후 교체
const DUMMY_POST: PostDetail = {
  id: 0,
  title: '(임시) 게시글 제목',
  content: '<p>(임시) 본문 내용이 여기에 표시됩니다.</p>',
  category: '자유',
  createdAt: '2026-04-24',
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  isLiked: false,
  isAuthor: false,
  author: { id: 0, nickname: '작성자', profileImage: null },
}

export function CommunityDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // TODO(API): posts/detail — GET /api/v1/posts/{post_id} 연동
  const post: PostDetail = DUMMY_POST

  // TODO(좋아요): authStore 로그인 상태 연동
  const isLoggedIn = false

  // TODO(로딩/에러): 로딩 중 Spinner, 에러 시 에러 메시지 처리 추가

  const handleEdit = () => {
    navigate(`/community/${postId}/edit`)
  }

  const handleDeleteConfirm = () => {
    // TODO(API): posts/delete — DELETE /api/v1/posts/{post_id} 연동
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={() => navigate('/community')}
        className="text-text-muted hover:text-text-body mb-8 flex items-center gap-1.5 text-sm transition-colors"
      >
        <span aria-hidden="true">←</span>
        커뮤니티 목록
      </button>

      <article>
        {/* 헤더: 카테고리 · 제목 · 작성자 · 메타 */}
        <PostHeader
          category={post.category}
          title={post.title}
          author={post.author}
          createdAt={post.createdAt}
          viewCount={post.viewCount}
        />

        {/* 수정/삭제 버튼 — 작성자 전용 */}
        {post.isAuthor && (
          <PostAuthorActions
            onEdit={handleEdit}
            onDelete={() => setIsDeleteModalOpen(true)}
          />
        )}

        {/* 본문 (HTML · 이미지 포함) */}
        <PostBody content={post.content} />

        {/* 좋아요 */}
        <PostActions
          likeCount={post.likeCount}
          isLiked={post.isLiked}
          isLoggedIn={isLoggedIn}
          onLike={() => {
            // TODO(좋아요): posts/like — POST /api/v1/posts/{post_id}/like 연동
          }}
        />

        {/* 댓글 (별도 이슈) */}
        <CommentSection postId={post.id} commentCount={post.commentCount} />
      </article>

      {/* 게시글 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        message={`게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.`}
        confirmLabel="삭제"
        danger
        onConfirm={handleDeleteConfirm}
      />
    </main>
  )
}
