/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateImageRequest {
    caption: string
    url: string
    updatedAt: string
    is_published: number
}