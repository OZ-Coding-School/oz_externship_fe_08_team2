import { http, HttpResponse } from 'msw'
import { postDetailHandlers } from '@/features/posts/detail'
import { postLikeHandlers } from '@/features/posts/like'
import { postDeleteHandlers } from '@/features/posts/delete'
import { commentsHandlers } from '@/features/posts/comments'

export const handlers = [
  // 예시 핸들러 — 실제 API에 맞게 수정하세요
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  ...commentsHandlers,

  ...postDetailHandlers,
  ...postLikeHandlers,
  ...postDeleteHandlers,
]
