import { apiEndpoint } from '../config'
import { Img } from '../types/Image';
import Axios from 'axios'
import { CreateImageRequest } from '../types/CreateImageRequest';
import { UpdateImageRequest } from '../types/UpdateImageRequest';
import { PublishImageRequest } from '../types/PublishImageRequest';

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
  const response = await Axios.post(`${apiEndpoint}/images`, JSON.stringify(newImage), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
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