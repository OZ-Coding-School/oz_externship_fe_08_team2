import { useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { PostListParams, PostListResponse } from './types'

export function usePostList(params: PostListParams = {}) {
  return useQuery({
    queryKey: ['posts', 'list', params],
    queryFn: async () => {
      const { data } = await api.get<PostListResponse>('/api/v1/posts/', {
        params,
      })
      return data
    },
    staleTime: 60_000,
  })
}
