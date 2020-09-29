
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
import { UnpublishedImage } from '../types/UnpublishedImage'
import Gallery from 'react-grid-gallery';
import '../App.css'

interface ImagesProps {
    auth: Auth
    history: History
}

interface ImagesState {
    images: UnpublishedImage[]
    loadingImages: boolean
    selectAllChecked: boolean
}

export class UserUnpublishedImages extends React.PureComponent<ImagesProps, ImagesState> {
    state: ImagesState = {
        images: [],
        loadingImages: true,
        selectAllChecked: false
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

    renderImagesList() {
        return (
            <div className="gallery-wrapper">
                <Gallery images={this.state.images}
                onSelectImage={this.onSelectImage}
                showLightboxThumbnails={true} />
            </div>
        )
    }

    calculateDueDate(): string {
        const date = new Date()
        date.setDate(date.getDate() + 7)
        return dateFormat(date, 'yyyy-mm-dd HH:MM:ss') as string
    }
}