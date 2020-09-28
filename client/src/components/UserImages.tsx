import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Grid,
  Header,
  Loader,
} from 'semantic-ui-react'
import { getUserImages } from '../api/images-api'
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

export class UserImages extends React.PureComponent<ImagesProps, ImagesState> {
  state: ImagesState = {
    images: [],
    loadingImages: true,
  }


  async componentDidMount() {
    if (this.props.auth.isAuthenticated()) {
      try {
        let images = await getUserImages(this.props.auth.getIdToken())
        let galleryimages = images.map(image => {
          return {
            imageId: image.imageId,
            caption: image.caption,
            src: image.urls.raw,
            thumbnail: image.urls.thumb,
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
  }

  render() {
    const loggedIn = this.props.auth.isAuthenticated()
      if (loggedIn) {
        return (
          <div>
            <Header as="h1">My Images</Header>
            {this.renderImages()}
          </div>
        )
      } else {
        return (
          <div>
            <Header as="h1">User not logged in</Header>
          </div>
        )
      }
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
    date.setDate(date.getDate() + 7)
    return dateFormat(date, 'yyyy-mm-dd HH:MM:ss') as string
  }
}