/**
 * @figma 커뮤니티 상세 페이지 (비회원)     https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-10472&m=dev
 * @figma 커뮤니티 상세 페이지 (회원)        https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-10585&m=dev
 * @figma 커뮤니티 상세 페이지 (회원-작성자) https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-10696&m=dev
 */
import { Suspense, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ConfirmModal } from '@/components/common/Modal/ConfirmModal'
import { PostHeader } from '@/components/community/PostHeader'
import { PostAuthorActions } from '@/components/community/PostAuthorActions'
import { PostBody } from '@/components/community/PostBody'
import { PostActions } from '@/components/community/PostActions'
import { CommentSection } from '@/components/community/CommentSection'
import { usePostDetail } from '@/features/posts/detail'
import { useTogglePostLike } from '@/features/posts/like'
import { useDeletePost } from '@/features/posts/delete'
import { useAuthStore } from '@/stores/authStore'

function CommunityDetailContent({ postId }: { postId: number }) {
  const navigate = useNavigate()
  const { data: post } = usePostDetail(postId)
  const { isAuthenticated, user } = useAuthStore()

  const isLoggedIn = isAuthenticated
  const isAuthor = isAuthenticated && user?.nickname === post.author.nickname

  const [isLiked, setIsLiked] = useState(post.is_liked ?? false)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { mutate: toggleLike } = useTogglePostLike(postId)
  const { mutate: deletePost } = useDeletePost()

  const handleEdit = () => {
    navigate(`/community/${postId}/edit`)
  }

  const handleLike = () => {
    toggleLike(isLiked, {
      onSuccess: (data) => {
        setIsLiked(data.is_liked)
        setLikeCount(data.like_count)
      },
    })
  }

  const handleDeleteConfirm = () => {
    deletePost(postId, {
      onSuccess: () => {
        navigate('/community')
      },
    })
  }

  return (
    <main className="mx-auto w-full px-4 py-10" style={{ maxWidth: '944px' }}>
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
          category={post.category_name}
          title={post.title}
          author={{
            nickname: post.author.nickname,
            profileImage: post.author.profile_img_url,
          }}
          createdAt={post.created_at}
          viewCount={post.view_count}
        />

        {/* 수정/삭제 버튼 — 작성자 전용 */}
        {isAuthor && (
          <PostAuthorActions
            onEdit={handleEdit}
            onDelete={() => setIsDeleteModalOpen(true)}
          />
        )}

        {/* 본문 (HTML · 이미지 포함) */}
        <PostBody content={post.content} />

        {/* 좋아요 */}
        <PostActions
          likeCount={likeCount}
          isLiked={isLiked}
          isLoggedIn={isLoggedIn}
          onLike={handleLike}
        />

        {/* 댓글 (별도 이슈) */}
        <CommentSection
          postId={post.id}
          commentCount={post.comment_count ?? 0}
        />
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

export function CommunityDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const postIdNum = Number(postId)

  if (isNaN(postIdNum)) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-text-muted">잘못된 게시글 ID입니다.</p>
      </main>
    )
  }

  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-4 py-10">
          <p className="text-text-muted">로딩 중...</p>
        </main>
      }
    >
      <CommunityDetailContent postId={postIdNum} />
    </Suspense>
  )
}
