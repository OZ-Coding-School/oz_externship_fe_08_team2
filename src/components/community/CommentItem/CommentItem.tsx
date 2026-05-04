import DOMPurify from 'dompurify'
import { Avatar } from '@/components'
import type { Comment, TaggedUser } from '@/features/posts/comments'

function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(isoString))
}

function parseContent(
  content: string,
  taggedUsers: TaggedUser[]
): React.ReactNode[] {
  const clean = DOMPurify.sanitize(content)
  const mentionRegex = /@(\S+)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = mentionRegex.exec(clean)) !== null) {
    const nickname = match[1]
    const isTagged = taggedUsers.some((u) => u.nickname === nickname)

    if (match.index > lastIndex) {
      parts.push(clean.slice(lastIndex, match.index))
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

  if (lastIndex < clean.length) {
    parts.push(clean.slice(lastIndex))
  }

  return parts
}

interface CommentItemProps {
  comment: Comment
  isOwn: boolean
  onDelete?: () => void
  isDeleting?: boolean
}

export function CommentItem({
  comment,
  isOwn,
  onDelete,
  isDeleting = false,
}: CommentItemProps) {
  return (
    <div className="flex gap-3 py-4">
      <Avatar
        src={comment.author.profile_img_url}
        alt={comment.author.nickname}
        size="sm"
      />
      <div className="min-w-0 flex-1 border-b border-gray-200 pb-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-text-heading text-sm font-semibold">
            {comment.author.nickname}
          </span>
          <span className="text-text-muted text-xs">
            {formatDate(comment.created_at)}
            {isOwn && (
              <>
                {' | '}
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={onDelete}
                  className="transition-colors duration-150 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </>
            )}
          </span>
        </div>
        <p className="text-text-body text-sm leading-relaxed break-words">
          {parseContent(comment.content, comment.tagged_users)}
        </p>
      </div>
    </div>
  )
}
