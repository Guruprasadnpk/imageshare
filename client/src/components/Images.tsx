import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Grid,
  Header,
  Loader
} from 'semantic-ui-react'
import { getPublishedImages } from '../api/images-api'
import Auth from '../auth/Auth'
import { GalleryImage } from '../types/GalleryImage'
import Gallery from 'react-grid-gallery';

interface ImagesProps {
  auth: Auth
  history: History
}

interface ImagesState {
  images: GalleryImage[]
  loadingImages: boolean
}

export class Images extends React.PureComponent<ImagesProps, ImagesState> {
  state: ImagesState = {
    images: [],
    loadingImages: true
  }

  async componentDidMount() {
    try {
      let images = await getPublishedImages()
      let galleryimages = images.map(image => {
        return {
          imageId: image.imageId,
          caption: image.caption + ' by ' + image.accountId,
          src: image.urls?.raw && image.urls.raw,
          thumbnail: image.urls?.thumb && image.urls.thumb,
          thumbnailWidth: 250,
          thumbnailHeight: 350
        }
      });
      this.setState({
        images: galleryimages,
        loadingImages: false
      })
    } catch (e) {
      alert(`Failed to fetch images: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Imageshare</Header>
        {this.renderImages()}
      </div>
    )
  }

  renderImages() {
    if (this.state.loadingImages) {
      return this.renderLoading()
    }
    return this.renderImagesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Images
        </Loader>
      </Grid.Row>
    )
  }

  renderImagesList() {
    return (
      <Gallery images={this.state.images} />
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate())
    const utc_date = date.getUTCDate()
    return dateFormat(utc_date, "yyyy-mm-dd'T'HH:MM:ss+00:00") as string
  }
}