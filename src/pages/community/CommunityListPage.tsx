/**
 * @figma 커뮤니티 - 목록 페이지  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9801&m=dev
 */
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, SearchInput, Dropdown } from '@/components'
import { PostCard } from '@/components/community'
import type { Post } from '@/components/community'
import { ROUTES } from '@/constants/routes'

const SEARCH_TYPE_OPTIONS = [
  { value: 'title', label: '제목' },
  { value: 'content', label: '내용' },
  { value: 'author', label: '작성자' },
  { value: 'title_content', label: '제목+내용' },
]

export function CommunityListPage() {
  const posts: Post[] = []
  const navigate = useNavigate()
  const [searchType, setSearchType] = useState('title')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text-heading">커뮤니티</h1>
      </header>

      <div className="flex items-center gap-3">
        <Dropdown
          options={SEARCH_TYPE_OPTIONS}
          value={searchType}
          onChange={setSearchType}
          className="w-36 shrink-0"
        />
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="검색어를 입력하세요"
          className="flex-1"
        />
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.COMMUNITY.WRITE)}
        >
          글쓰기
        </Button>
      </div>

      <main className="mt-4">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </main>
    </div>
  )
}
