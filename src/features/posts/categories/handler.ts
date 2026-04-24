import { http, HttpResponse } from 'msw'

export const categoriesHandlers = [
  http.get('/api/v1/posts/categories', () => {
    return HttpResponse.json([
      { id: 1, name: '전체 게시판' },
      { id: 2, name: '자유 게시판' },
      { id: 3, name: '질문 게시판' },
      { id: 4, name: '정보 게시판' },
    ])
  }),
]
