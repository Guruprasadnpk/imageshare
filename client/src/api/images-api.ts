import { apiEndpoint } from '../config'
import { Img } from '../types/Image';
import Axios from 'axios'
import { CreateImageRequest } from '../types/CreateImageRequest';

export async function getImages(idToken: string): Promise<Img[]> {
  console.log('Fetching images')

  const response = await Axios.get(`${apiEndpoint}/images`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Images:', response.data)
  return response.data.items
}

export async function getPublishedImages(): Promise<Img[]> {
  console.log('Fetching images')

  const response = await Axios.get(`${apiEndpoint}/pubimages`, {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  console.log('Images:', response.data)
  return response.data.items
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
