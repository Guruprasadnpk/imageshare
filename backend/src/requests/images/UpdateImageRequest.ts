/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateImageRequest {
    caption: string
    urls: {
        raw: string,
        thumb: string
    }
    updatedAt: string
    is_published: number
}