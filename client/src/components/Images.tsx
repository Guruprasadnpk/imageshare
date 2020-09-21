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
import { Img } from '../types/Image'
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

interface ImagesProps {
  auth: Auth
  history: History
}

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
  }
`;

const WrapperImages = styled.section`
  max-width: 70rem;
  margin: 4rem auto;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: auto;
`;

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
            <div>
              <GlobalStyle />
                <WrapperImages>
                  {this.state.images.map(image => (
                    <>
                      <img key={img.imageId} src={image.urls.thumb} alt="" />
                    </>
                  ))}
                </WrapperImages>
            </div>
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
