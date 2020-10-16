import { apiEndpoint } from '../config'
import Axios from 'axios'
import { CreateImageRequest } from '../types/CreateImageRequest';
import { UpdateImageRequest } from '../types/UpdateImageRequest';
import { PublishImageRequest } from '../types/PublishImageRequest';
import { Img } from '../types/Image';

export async function getUserImages(idToken: string): Promise<Img[]> {
  console.log('Fetching User images')

  const response = await Axios.get(`${apiEndpoint}/images`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Images:', response.data)
  return response.data.images
}

export async function getPublishedImages(): Promise<Img[]> {
  console.log('Fetching images')

  const response = await Axios.get(`${apiEndpoint}/pubimages`, {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  console.log('Images:', response.data)
  return response.data.images
}

export async function createImage(
  idToken: string,
  newImage: CreateImageRequest
): Promise<Img> {
  console.log('Creating image', JSON.stringify(newImage))
  const response = await Axios.post(`${apiEndpoint}/images`, JSON.stringify(newImage), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.image
}

export async function updateImage(
  idToken: string,
  imageId: string,
  updateImage: UpdateImageRequest
): Promise<Img> {
  const response = await Axios.patch(`${apiEndpoint}/images/${imageId}`, JSON.stringify(updateImage), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
}

export async function publishImage(
  idToken: string,
  imageId: string,
  publishImage: PublishImageRequest
): Promise<Img> {
  const response = await Axios.patch(`${apiEndpoint}/images/${imageId}/publish`, JSON.stringify(publishImage), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
}

export async function deleteImage(
  idToken: string,
  imageId: string
): Promise<Img> {
  const response = await Axios.delete(`${apiEndpoint}/images/${imageId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
}

export async function getUploadUrl(
  idToken: string,
  imageId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/images/${imageId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}