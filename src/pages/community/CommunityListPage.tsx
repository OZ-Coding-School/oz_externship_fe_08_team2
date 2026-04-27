/**
 * @figma 커뮤니티 - 목록 페이지  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-9801&m=dev
 */
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Dropdown, SearchInput, Tabs, TabList, Tab } from '@/components'
import { ROUTES } from '@/constants/routes'

const SEARCH_TYPE_OPTIONS = [
  { value: 'title', label: '제목' },
  { value: 'content', label: '내용' },
  { value: 'author', label: '글쓴이' },
  { value: 'title_content', label: '제목+내용' },
]

const CATEGORY_TABS = [
  { value: 'all', label: '전체' },
  { value: 'popular', label: '인기글' },
  { value: 'notice', label: '공지사항' },
  { value: 'free', label: '자유게시판' },
  { value: 'recruit', label: '구인, 협업' },
  { value: 'resource', label: '자료공유' },
]

const SORT_OPTIONS = [
  { value: 'latest', label: '최신' },
  { value: 'created_at', label: '작성일' },
  { value: 'likes', label: '추천수' },
  { value: 'comments', label: '댓글수' },
]

export function CommunityListPage() {
  const navigate = useNavigate()
  const [searchType, setSearchType] = useState(SEARCH_TYPE_OPTIONS[0].value)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState(CATEGORY_TABS[0].value)
  const [sort, setSort] = useState(SORT_OPTIONS[0].value)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* 검색 헤더 */}
      <div className="flex items-center gap-3">
        <Dropdown
          options={SEARCH_TYPE_OPTIONS}
          value={searchType}
          onChange={setSearchType}
          placeholder="검색유형"
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
          className="shrink-0"
          onClick={() => navigate(ROUTES.COMMUNITY.WRITE)}
        >
          글쓰기
        </Button>
      </div>

      {/* 카테고리 탭 + 정렬 */}
      <div className="mt-6 flex items-end justify-between">
        <Tabs value={category} onChange={setCategory}>
          <TabList aria-label="게시글 카테고리">
            {CATEGORY_TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value}>
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <div className="flex shrink-0 items-center gap-1 pb-1 pl-4">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSort(option.value)}
              className={[
                'cursor-pointer rounded px-2.5 py-1 text-sm transition-colors duration-150',
                sort === option.value
                  ? 'text-primary font-semibold'
                  : 'text-text-muted hover:text-text-body',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
