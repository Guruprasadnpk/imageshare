export interface UpdateImageRequest {
  caption: string
  urls: {
    raw: string,
    thumb: string
  }
  is_published: number
  updatedAt: string
}