export interface ImageUpdate {
    caption: string
    urls: {
        raw: string,
        thumb: string
    }
    updatedAt: string
    is_published: number
}