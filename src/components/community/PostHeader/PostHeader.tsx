import { Avatar } from '@/components/common/Avatar'

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
    <div className="flex flex-col gap-6">
      {/* 카테고리 + 제목 + 프로필 */}
      <div className="flex flex-col gap-6">
        <span className="text-primary text-xl font-bold">{category}</span>

        <div className="flex items-start justify-between gap-6">
          <h1 className="text-text-heading text-[32px] leading-snug font-bold">
            {title}
          </h1>
          <div className="flex shrink-0 items-center gap-3">
            <Avatar src={author.profileImage} alt={author.nickname} size="lg" />
            <span className="text-base font-semibold text-gray-600">
              {author.nickname}
            </span>
          </div>
        </div>
      </div>

      {/* 조회수 · 좋아요 · 시간 메타 정보 */}
      <div className="flex items-center gap-1 text-base text-gray-400">
        <span>조회수 {viewCount.toLocaleString()}</span>
        <span className="text-disable" aria-hidden="true">
          ·
        </span>
        <span>{createdAt}</span>
      </div>
    </div>
  )
}
