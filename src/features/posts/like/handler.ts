import { http, HttpResponse } from 'msw'
import type { PostLikeResponse } from './types'

// postId별 좋아요 수를 관리 (초기값: detail 핸들러와 동일한 3)
const likeCountMap = new Map<number, number>()
const getLikeCount = (postId: number) => likeCountMap.get(postId) ?? 3

export const postLikeHandlers = [
  http.post('/api/v1/posts/:post_id/like', ({ params }) => {
    const postId = Number(params.post_id)
    const newCount = getLikeCount(postId) + 1
    likeCountMap.set(postId, newCount)
    const body: PostLikeResponse = {
      detail: '좋아요가 추가되었습니다.',
      post_id: postId,
      is_liked: true,
      like_count: newCount,
    }
    return HttpResponse.json(body)
  }),
  http.delete('/api/v1/posts/:post_id/like', ({ params }) => {
    const postId = Number(params.post_id)
    const newCount = Math.max(0, getLikeCount(postId) - 1)
    likeCountMap.set(postId, newCount)
    const body: PostLikeResponse = {
      detail: '좋아요가 취소되었습니다.',
      post_id: postId,
      is_liked: false,
      like_count: newCount,
    }
    return HttpResponse.json(body)
  }),
]
