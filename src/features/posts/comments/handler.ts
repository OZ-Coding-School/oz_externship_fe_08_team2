import { http, HttpResponse } from 'msw'
import type { CommentsResponse } from './types'

const TOTAL = 25

const mockComments = Array.from({ length: TOTAL }, (_, i) => ({
  id: i + 1,
  author: {
    id: (i % 5) + 1,
    nickname: `user${(i % 5) + 1}`,
    profile_img_url: null,
  },
  tagged_users: i % 3 === 0 ? [{ id: 2, nickname: 'user2' }] : [],
  content:
    i % 3 === 0
      ? `@user2 댓글 내용 ${i + 1}번째 댓글입니다.`
      : `일반 댓글 내용 ${i + 1}번째 댓글입니다.`,
  created_at: new Date(Date.now() - i * 60_000).toISOString(),
  updated_at: new Date(Date.now() - i * 60_000).toISOString(),
}))

export const commentsHandlers = [
  http.get('/api/v1/posts/:postId/comments', ({ params, request }) => {
    const { postId } = params

    if (postId === '999') {
      return HttpResponse.json(
        { error_detail: '해당 게시글을 찾을 수 없습니다.' },
        { status: 404 },
      )
    }

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('page_size') ?? 10)

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const results = mockComments.slice(start, end)
    const hasNext = end < TOTAL

    const response: CommentsResponse = {
      count: TOTAL,
      next: hasNext
        ? `http://localhost:5173/api/v1/posts/${postId}/comments?page=${page + 1}&page_size=${pageSize}`
        : null,
      previous:
        page > 1
          ? `http://localhost:5173/api/v1/posts/${postId}/comments?page=${page - 1}&page_size=${pageSize}`
          : null,
      results,
    }

    return HttpResponse.json(response)
  }),
]
