
import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
    Grid,
    Header,
    Loader,
    Button
} from 'semantic-ui-react'
import { getUserImages, publishImage, deleteImage } from '../api/images-api'
import Auth from '../auth/Auth'
import { UnpublishedImage } from '../types/UnpublishedImageRequest'
import Gallery from 'react-grid-gallery';
import '../App.css'
import { PublishImageRequest } from '../types/PublishImageRequest'

interface ImagesProps {
    auth: Auth
    history: History
}

interface ImagesState {
    images: UnpublishedImage[]
    loadingImages: boolean
}

export class UserImages extends React.PureComponent<ImagesProps, ImagesState> {
    constructor(props: ImagesProps) {
        super(props)
        this.onSelectImage = this.onSelectImage.bind(this);
        this.getSelectedImages = this.getSelectedImages.bind(this);
    }

    state: ImagesState = {
        images: [],
        loadingImages: true
    }

    onSelectImage(index) {
        var images = this.state.images.slice();
        var img = images[index];
        if (img.hasOwnProperty("isSelected"))
            img.isSelected = !img.isSelected;
        else
            img.isSelected = true;

        this.setState({
            images: images
        });
    }

    getSelectedImages() {
        var selected: number[] = [];
        for (var i = 0; i < this.state.images.length; i++)
            if (this.state.images[i].isSelected === true)
                selected.push(i);
        return selected;
    }

    async componentDidMount() {
        if (this.props.auth.isAuthenticated()) {
            try {
                let images = await getUserImages(this.props.auth.getIdToken())
                let galleryimages = images.filter(image => (!image.is_published && image.urls?.raw)).map(image => {
                    return {
                        imageId: image.imageId,
                        caption: image.caption,
                        src: image.urls?.raw,
                        thumbnail: image.urls?.thumb,
                        thumbnailWidth: 250,
                        thumbnailHeight: 350,
                        isSelected: false
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

    handleCreate = () => {
        this.props.history.push(`/images/create`)
    }

    handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault()

        try {
            var images = this.state.images.slice();
            var no_of_selected_images = 0
            for (var i = 0; i < this.state.images.length; i++) {
                if (images[i].isSelected) {
                    no_of_selected_images++
                }
            }
            if (no_of_selected_images === 0) {
                alert('Files should be selected')
                return
            }

            for (var j = 0; j < this.state.images.length; j++)
                if (images[j].isSelected) {
                    var imageId = images[j].imageId
                    var payload: PublishImageRequest = {
                        is_published: 1,
                        updatedAt: this.calculateDueDate()
                    }
                    await publishImage(this.props.auth.getIdToken(), imageId, payload)

                    this.setState({
                        images: this.state.images.filter(image => image.imageId !== imageId)
                    });
                }
            alert('File(s) was uploaded!')
        } catch (e) {
            alert('Could not upload a file: ' + e.message)
        }
    }


    handleDelete = async (event: React.SyntheticEvent) => {
        event.preventDefault()

        try {
            var images = this.state.images.slice();
            var no_of_selected_images = 0
            for (var i = 0; i < this.state.images.length; i++) {
                if (images[i].isSelected) {
                    no_of_selected_images++
                }
            }
            if (no_of_selected_images === 0) {
                alert('Files should be selected')
                return
            }

            for (var j = 0; j < this.state.images.length; j++) 
                if (images[j].isSelected) {
                    var imageId = images[j].imageId
                    await deleteImage(this.props.auth.getIdToken(), imageId)

                    this.setState({
                        images: this.state.images.filter(image => image.imageId !== imageId)
                    });
                }
            alert('Deleted File(s)')
        } catch (e) {
            alert('Could not upload a file: ' + e.message)
        }
    }

    renderImagesList() {
        return (
            <>
            <div>
                    Create a new image: <Button onClick={this.handleCreate}>New Image</Button> <br></br>
                    Select one or more images and publish: <Button onClick={this.handleSubmit}>Publish</Button><br></br>
                    Select one or more images and delete: <Button onClick={this.handleDelete}>Delete</Button><br></br>
            </div>
            <div className="gallery-wrapper">
                <Gallery images={this.state.images}
                    onSelectImage={this.onSelectImage}
                    showLightboxThumbnails={true} />
            </div>
            </>
        )
    }

    renderPublishButton() {
        return (
            <div>
                <Button
                    type="submit"
                >
                    Publish
                </Button>
            </div>
        )
    }

    renderDeleteButton() {
        return (
            <div>
                <Button
                    type="submit"
                >
                    Delete
                </Button>
            </div>
        )
    }

    calculateDueDate(): string {
        const date = new Date()
        const utc_date = date.getUTCDate();
        return dateFormat(utc_date, "yyyy-mm-dd'T'HH:MM:ss+00:00") as string
    }
}