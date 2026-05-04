import { delay, http, HttpResponse } from 'msw'
import type { PostDetailResponse } from './types'
import { likeMockStore } from '../mockStore'

const dummyPostBase = {
  author: {
    id: 1,
    nickname: 'testuser',
    profile_img_url: 'https://example.com/profile.png',
  },
  category_id: 1,
  category_name: '자유게시판',
  title: '테스트 게시글',
  content: '게시글 내용입니다.',
  view_count: 10,
  created_at: '2026-03-01T12:00:00Z',
  updated_at: '2026-03-01T12:00:00Z',
  comment_count: 5,
}

export const postDetailHandlers = [
  http.get('/api/v1/posts/:post_id', async ({ params }) => {
    await delay(300)
    const postId = Number(params.post_id)
    const response: PostDetailResponse = {
      ...dummyPostBase,
      id: postId,
      like_count: likeMockStore.getLikeCount(postId),
      is_liked: likeMockStore.getIsLiked(postId),
    }
    return HttpResponse.json(response)
  }),
]
