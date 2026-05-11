export interface UpdatePostRequest {
  title: string
  content: string
  category_id: number
}

export interface UpdatePostResponse {
  id: number
  title: string
  content: string
  category: {
    id: number
    name: string
  }
}
