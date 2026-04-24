export interface CreatePostRequest {
  title: string
  content: string
  category_id: number
}

export interface CreatePostResponse {
  detail: string
  pk: number
}

export interface PresignedUrlRequest {
  file_name: string
}

export interface PresignedUrlResponse {
  presigned_url: string
  img_url: string
  key: string
}
