import { useInfiniteQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { CommentsResponse } from './types'

const PAGE_SIZE = 10

export function useCommentsInfiniteQuery(postId: number) {
  return useInfiniteQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: async ({ pageParam }) => {
      const response = await api.get<CommentsResponse>(
        `/api/v1/posts/${postId}/comments`,
        { params: { page: pageParam, page_size: PAGE_SIZE } },
      )
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined
      const url = new URL(lastPage.next)
      const nextPage = url.searchParams.get('page')
      return nextPage ? Number(nextPage) : undefined
    },
  })
}
