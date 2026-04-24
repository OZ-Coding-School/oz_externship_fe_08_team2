import { Avatar } from '@/components/common/Avatar'
import { Badge } from '@/components/common/Badge'

export interface PostHeaderProps {
  category: string
  title: string
  author: {
    nickname: string
    profileImage: string | null
  }
  createdAt: string
  viewCount: number
}

export function PostHeader({
  category,
  title,
  author,
  createdAt,
  viewCount,
}: PostHeaderProps) {
  return (
    <div className="border-border-base flex flex-col gap-3 border-b pb-6">
      <Badge variant="primary" size="sm">
        {category}
      </Badge>

      <h1 className="text-text-heading text-2xl leading-snug font-bold">
        {title}
      </h1>

      <div className="text-text-muted flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Avatar src={author.profileImage} alt={author.nickname} size="sm" />
          <span className="text-text-body font-medium">{author.nickname}</span>
          <span aria-hidden="true">·</span>
          <span>{createdAt}</span>
        </div>
        <span>조회 {viewCount.toLocaleString()}</span>
      </div>
    </div>
  )
}
