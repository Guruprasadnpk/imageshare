
import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
    Grid,
    Header,
    Loader,
    Form,
    Button
} from 'semantic-ui-react'
import { getUserImages, publishImage } from '../api/images-api'
import Auth from '../auth/Auth'
import { UnpublishedImage } from '../types/UnpublishedImage'
import Gallery from 'react-grid-gallery';
import '../App.css'
import { PublishImageRequest } from '../types/PublishImageRequest'

enum UploadState {
    NoUpload,
    UploadingFiles,
}

interface ImagesProps {
    auth: Auth
    history: History
}

interface ImagesState {
    images: UnpublishedImage[]
    loadingImages: boolean
    selectAllChecked: boolean
    uploadState: UploadState
}

export class UserUnpublishedImages extends React.PureComponent<ImagesProps, ImagesState> {
    state: ImagesState = {
        images: [],
        loadingImages: true,
        selectAllChecked: false,
        uploadState: UploadState.NoUpload
    }

    allImagesSelected(images) {
        var f = images.filter(
            function (img) {
                return img.isSelected === true;
            }
        );
        return f.length === images.length;
    }

    onSelectImage(index, image) {
        var images = this.state.images.slice();
        var img = images[index];
        if (img.hasOwnProperty("isSelected"))
            img.isSelected = !img.isSelected;
        else
            img.isSelected = true;

        this.setState({
            images: images
        });

        if (this.allImagesSelected(images)) {
            this.setState({
                selectAllChecked: true
            });
        }
        else {
            this.setState({
                selectAllChecked: false
            });
        }
    }

    getSelectedImages() {
        var selected: number[] = [];
        for (var i = 0; i < this.state.images.length; i++)
            if (this.state.images[i].isSelected === true)
                selected.push(i);
        return selected;
    }

    onClickSelectAll() {
        var selectAllChecked = !this.state.selectAllChecked;
        this.setState({
            selectAllChecked: selectAllChecked
        });

        var images = this.state.images.slice();
        if (selectAllChecked) {
            for (var i = 0; i < this.state.images.length; i++)
                images[i].isSelected = true;
        }
        else {
            for (var j = 0; j < this.state.images.length; j++)
                images[j].isSelected = false;

        }
        this.setState({
            images: images
        });
    }

    async componentDidMount() {
        this.onSelectImage = this.onSelectImage.bind(this);
        this.getSelectedImages = this.getSelectedImages.bind(this);
        this.onClickSelectAll = this.onClickSelectAll.bind(this);

        if (this.props.auth.isAuthenticated()) {
            try {
                let images = await getUserImages(this.props.auth.getIdToken())
                let galleryimages = images.filter(image => (!image.is_published)).map(image => {
                    return {
                        imageId: image.imageId,
                        caption: image.caption,
                        src: image.urls.raw,
                        thumbnail: image.urls.thumb,
                        thumbnailWidth: 250,
                        thumbnailHeight: 350,
                        isSelected: false
                    }
                });
                this.setState({
                    images: galleryimages,
                    loadingImages: false,
                    selectAllChecked: false
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

    setUploadState(uploadState: UploadState) {
        this.setState({
            uploadState
        })
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

            this.setUploadState(UploadState.UploadingFiles)
            
            for (var j = 0; j < this.state.images.length; j++)
                if (images[j].isSelected) {
                    var imageId = images[j].imageId
                    var payload: PublishImageRequest = {
                        is_published: 1,
                        updatedAt: this.calculateDueDate()
                    }
                    console.log(payload)
                    console.log(this.props.auth.getIdToken())
                    await publishImage(this.props.auth.getIdToken(), imageId, payload)
                }

            alert('File(s) was uploaded!')
        } catch (e) {
            alert('Could not upload a file: ' + e.message)
        } finally {
            this.setUploadState(UploadState.NoUpload)
        }
    }

    renderImagesList() {
        return (
            <div className="gallery-wrapper">
                <Form onSubmit={this.handleSubmit}>
                    { this.renderButton() }
                </Form>

                <Gallery images={this.state.images}
                onSelectImage={this.onSelectImage}
                showLightboxThumbnails={true} />
            </div>
        )
    }

    renderButton() {

        return (
            <div>
                {this.state.uploadState === UploadState.UploadingFiles && <p>Uploading file</p>}
                <Button
                    loading={this.state.uploadState !== UploadState.NoUpload}
                    type="submit"
                >
                    Publish
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