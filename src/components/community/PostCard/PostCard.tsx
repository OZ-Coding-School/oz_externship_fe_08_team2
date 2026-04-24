import { useNavigate } from 'react-router'
import { ROUTES } from '@/constants/routes'

export interface Post {
  postId: number
  title: string
  content: string
  imageUrl?: string
  author: string
  createdAt: string
}

interface PostCardProps {
  post: Post
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate()
  const snippet = post.content.length > 50 ? post.content.slice(0, 50) + '…' : post.content

  const handleClick = () => {
    navigate(ROUTES.COMMUNITY.DETAIL.replace(':postId', String(post.postId)))
  }

  return (
    <article
      onClick={handleClick}
      className="flex cursor-pointer items-start gap-4 border-b border-border-base py-5 transition-colors duration-150 hover:bg-bg-subtle"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h2 className="truncate text-base font-semibold text-text-heading">{post.title}</h2>
        <p className="text-sm leading-relaxed text-text-body">{snippet}</p>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>{post.author}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt=""
          className="h-20 w-20 shrink-0 rounded-lg object-cover"
        />
      )}
    </article>
  )
}
