export interface CommentAuthor {
  id: number
  nickname: string
  profile_img_url: string | null
}

export interface TaggedUser {
  id: number
  nickname: string
}

export interface Comment {
  id: number
  author: CommentAuthor
  tagged_users: TaggedUser[]
  content: string
  created_at: string
  updated_at: string
}

export interface CommentsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Comment[]
}

export interface CommentSubmitRequest {
  content: string
}
