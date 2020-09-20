import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Grid,
  Header,
  Image,
  Loader
} from 'semantic-ui-react'

import { getImages, getPublishedImages } from '../api/images-api'
import Auth from '../auth/Auth'
import { Img } from '../types/Image'

interface ImagesProps {
  auth: Auth
  history: History
}

interface ImagesState {
  images: Img[]
  newImageName: string
  loadingImages: boolean
}

export class Images extends React.PureComponent<ImagesProps, ImagesState> {
  state: ImagesState = {
    images: [],
    newImageName: '',
    loadingImages: true
  }

  async componentDidMount() {
    try {
      let images = await getPublishedImages()
      
      this.setState({
        images,
        loadingImages: false
      })
    } catch (e) {
      alert(`Failed to fetch images: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">IMAGEs</Header>

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
      <Grid padded>
        {this.state.images.map((img, pos) => {
          return (
            <Grid.Row key={img.imageId}>
              {img.urls.thumb && (
                <Image src={img.urls.thumb} size="medium" wrapped />
              )}
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd HH:MM:ss') as string
  }
}
