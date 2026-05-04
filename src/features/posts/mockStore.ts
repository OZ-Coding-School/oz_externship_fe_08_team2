/** MSW 핸들러 간 공유 in-memory 상태 (like_count, is_liked) */
export const likeMockStore = {
  likeCountMap: new Map<number, number>(),
  isLikedMap: new Map<number, boolean>(),
  getLikeCount: (postId: number): number =>
    likeMockStore.likeCountMap.get(postId) ?? 3,
  getIsLiked: (postId: number): boolean =>
    likeMockStore.isLikedMap.get(postId) ?? false,
}
