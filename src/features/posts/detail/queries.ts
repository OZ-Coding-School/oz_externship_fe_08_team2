import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { PostDetailResponse } from './types'

export const postDetailQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: ['posts', 'detail', postId],
    queryFn: async () => {
      const { data } = await api.get<PostDetailResponse>(
        `/api/v1/posts/${postId}`
      )
      return data
    },
    staleTime: 60_000,
    retry: 1,
  })

export const usePostDetail = (postId: number) =>
  useSuspenseQuery(postDetailQueryOptions(postId))
