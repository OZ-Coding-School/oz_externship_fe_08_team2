import { http, HttpResponse } from 'msw'
import type { PostLikeResponse } from './types'

export const postLikeHandlers = [
  http.post('/api/v1/posts/:post_id/like', ({ params }) => {
    const postId = Number(params.post_id)
    const body: PostLikeResponse = {
      detail: '좋아요가 추가되었습니다.',
      post_id: postId,
      is_liked: true,
      like_count: 4,
    }
    return HttpResponse.json(body)
  }),
  http.delete('/api/v1/posts/:post_id/like', ({ params }) => {
    const postId = Number(params.post_id)
    const body: PostLikeResponse = {
      detail: '좋아요가 취소되었습니다.',
      post_id: postId,
      is_liked: false,
      like_count: 3,
    }
    return HttpResponse.json(body)
  }),
]
