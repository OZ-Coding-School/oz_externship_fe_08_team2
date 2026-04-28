import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { PostDeleteResponse } from './types'

export const useDeletePost = () => {
  return useMutation({
    mutationFn: async (postId: number) => {
      const { data } = await api.delete<PostDeleteResponse>(
        `/api/v1/posts/${postId}`
      )
      return data
    },
  })
}
