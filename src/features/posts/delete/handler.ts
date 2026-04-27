import { http, HttpResponse } from 'msw'
import type { PostDeleteResponse } from './types'

export const postDeleteHandlers = [
  http.delete('/api/v1/posts/:post_id', () => {
    const body: PostDeleteResponse = {
      detail: '게시글이 삭제되었습니다.',
    }
    return HttpResponse.json(body)
  }),
]
