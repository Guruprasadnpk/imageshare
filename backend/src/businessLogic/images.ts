
import * as uuid from 'uuid'
import { ImageItem } from '../models/images/ImageItem'
import { ImagesAccess } from '../dataLayer/imageAccess'
import { CreateImageRequest } from '../requests/images/CreateImageRequest'
import { UpdateImageRequest } from '../requests/images/UpdateImageRequest'

const imageAccess = new ImagesAccess()

export async function getAllImages(accountId: string): Promise<ImageItem[]> {
    return imageAccess.getAllImages(accountId)
}

export async function getPublishedImages(): Promise<ImageItem[]> {
    return imageAccess.getPublishedImages()
}

export async function deleteImage(
    accountId: string,
    imageId: string) {
    return await imageAccess.deleteImage(accountId,
                                         imageId)
}

export async function imageExists(
    accountId: string,
    imageId: string) {
    return await imageAccess.imageExists(accountId,
                                         imageId)
}

export async function createImage(
    accountId: string,
    CreateImageRequest: CreateImageRequest
): Promise<ImageItem> {
    const imageId = uuid.v4()
    return await imageAccess.createImage({
        imageId: imageId,
        accountId: accountId,
        caption: CreateImageRequest.caption,
        createdAt: CreateImageRequest.createdAt,
        updatedAt: CreateImageRequest.updatedAt,
        is_published: CreateImageRequest.is_published
    })
}

export async function updateImage(
    imageId: string,
    accountId: string,
    UpdateImageRequest: UpdateImageRequest
) {
    return await imageAccess.updateImage(imageId, 
                                         accountId,
                                         UpdateImageRequest)
}

export async function addAttachment(
    accountId: string,
    imageId: string,
    attachmentUrl: string,
    thumbnailUrl: string
) {
    return await imageAccess.addAttachment(
        accountId,
        imageId,
        attachmentUrl,
        thumbnailUrl)
}