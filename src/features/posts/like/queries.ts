import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/instance'
import type { PostLikeResponse } from './types'

export const useTogglePostLike = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (isCurrentlyLiked: boolean) => {
      const { data } = isCurrentlyLiked
        ? await api.delete<PostLikeResponse>(`/api/v1/posts/${postId}/like`)
        : await api.post<PostLikeResponse>(`/api/v1/posts/${postId}/like`)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', postId],
      })
    },
  })
}
