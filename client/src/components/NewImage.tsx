import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
    Button,
    Divider,
    Grid,
    Header,
    Icon,
    Input,
    Loader
} from 'semantic-ui-react'

import { createImage, deleteImage, getUserImages } from '../api/images-api'
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

export class NewImage extends React.PureComponent<ImagesProps, ImagesState> {
    state: ImagesState = {
        images: [],
        newImageName: '',
        loadingImages: true
    }

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newImageName: event.target.value })
    }

    onEditButtonClick = (imageId: string) => {
        this.props.history.push(`/images/${imageId}/edit`)
    }

    onImageCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
        try {
            const createDt = this.calculateDueDate()
            const newImage = await createImage(this.props.auth.getIdToken(), {
                caption: this.state.newImageName,
                createdAt: createDt,
                updatedAt: createDt,
                is_published: 0
            })

            console.log(newImage)

            this.setState({
                images: [...this.state.images, newImage],
                newImageName: ''
            })
        } catch {
            alert('Image creation failed')
        }
    }

    onImageDelete = async (imageId: string) => {
        try {
            await deleteImage(this.props.auth.getIdToken(), imageId)
            this.setState({
                images: this.state.images.filter(image => image.imageId !== imageId)
            })
        } catch {
            alert('Image deletion failed')
        }
    }

    async componentDidMount() {
        try {
            const images = await getUserImages(this.props.auth.getIdToken())
            const imagesToEdit = images.filter(image => (!image.is_published && !image.urls))
            console.log("filtered Images", imagesToEdit)
            this.setState({
                images: imagesToEdit,
                loadingImages: false
            })
        } catch (e) {
            alert(`Failed to fetch todos: ${e.message}`)
        }
    }

    render() {
        return (
            <div>
                <Header as="h1">Upload Image</Header>
                {this.renderCreateTodoInput()}
                {this.renderTodos()}
            </div>
        )
    }

    renderCreateTodoInput() {
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <Input
                        action={{
                            color: 'teal',
                            labelPosition: 'left',
                            icon: 'add',
                            content: 'New image',
                            onClick: this.onImageCreate
                        }}
                        fluid
                        actionPosition="left"
                        placeholder="To change the world..."
                        onChange={this.handleNameChange}
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Divider />
                </Grid.Column>
            </Grid.Row>
        )
    }

    renderTodos() {
        if (this.state.loadingImages) {
            return this.renderLoading()
        }

        return this.renderTodosList()
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

    renderTodosList() {
        return (
            <Grid padded>
                {this.state.images.map((image, pos) => {
                    return (
                        <Grid.Row key={image.imageId}>
                            <Grid.Column width={10} verticalAlign="middle">
                                {image.caption}
                            </Grid.Column>
                            <Grid.Column width={1} floated="right">
                                <Button
                                    icon
                                    color="blue"
                                    onClick={() => this.onEditButtonClick(image.imageId)}
                                >
                                    <Icon name="pencil" />
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={1} floated="right">
                                <Button
                                    icon
                                    color="red"
                                    onClick={() => this.onImageDelete(image.imageId)}
                                >
                                    <Icon name="delete" />
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={1} floated="right">
                            </Grid.Column>
                            <Grid.Column width={1} floated="right">
                            </Grid.Column>
                            <Grid.Column width={16}>
                                <Divider />
                            </Grid.Column>
                        </Grid.Row>
                    )
                })}
            </Grid>
        )
    }

    calculateDueDate(): string {
        const date = new Date()
        date.setDate(date.getDate())
        return dateFormat(date, "yyyy-mm-dd'T'HH:MM:ss+00:00") as string
    }
}
