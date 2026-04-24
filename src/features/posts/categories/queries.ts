import { useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { Category } from './types'

export function useCategories() {
  return useQuery({
    queryKey: ['posts', 'categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/api/v1/posts/categories')
      return data
    },
    staleTime: 60_000,
    retry: 1,
  })
}
