export interface Img {
  imageId: string
  accountId: string
  caption: string
  urls: {
    raw: string,
    thumb: string
  }
  createdAt: string
  updatedAt: string
}