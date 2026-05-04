import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/instance'
import type { PostLikeResponse } from './types'
import type { PostDetailResponse } from '../detail/types'

export const useTogglePostLike = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (isCurrentlyLiked: boolean) => {
      const { data } = isCurrentlyLiked
        ? await api.delete<PostLikeResponse>(`/api/v1/posts/${postId}/like`)
        : await api.post<PostLikeResponse>(`/api/v1/posts/${postId}/like`)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData<PostDetailResponse>(
        ['posts', 'detail', postId],
        (prev) => {
          if (!prev) return prev
          return {
            ...prev,
            is_liked: data.is_liked,
            like_count: data.like_count,
          }
        }
      )
    },
  })
}
