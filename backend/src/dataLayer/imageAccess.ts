import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
const logger = createLogger('imageAccess')

import { ImageItem } from '../models/images/ImageItem'
import { ImageUpdate } from '../models/images/ImageUpdate'
const XAWS = AWSXRay.captureAWS(AWS)

const imageIdIndex = process.env.IMAGE_ID_INDEX
const imagePublishIndex = process.env.IMAGE_PUBLISH_INDEX
export class ImagesAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly imagesTable = process.env.IMAGES_TABLE) {
    }

    async getAllImages(accountId: String): Promise<ImageItem[]> {
        logger.info('Getting all images')

        const result = await this.docClient.query({
            TableName: this.imagesTable,
            IndexName: imageIdIndex,
            KeyConditionExpression: 'accountId = :accountId',
            ExpressionAttributeValues: {
                ':accountId': accountId
            }
        }).promise()

        const items = result.Items
        return items as ImageItem[]
    }

    async getPublishedImages(): Promise<ImageItem[]> {
        logger.info('Getting all images')

        const result = await this.docClient.scan({
            TableName: this.imagesTable,
            IndexName: imagePublishIndex,
            FilterExpression: 'is_published = :published',
            ExpressionAttributeValues: {
                ":published": 1
            }
        }).promise()

        const items = result.Items
        return items as ImageItem[]
    }

    async createImage(imageItem: ImageItem): Promise<ImageItem> {
        await this.docClient.put({
            TableName: this.imagesTable,
            Item: imageItem
        }).promise()

        return imageItem
    }

    async deleteImage(accountId: string, imageId: string) {
        await this.docClient.delete({
            TableName: this.imagesTable,
            Key: { accountId:accountId,
                   imageId: imageId
                }
        }).promise()
    }

    async updateImage(accountId: string, imageId: string, updatedImage: ImageUpdate) {
        const params = {
            TableName: this.imagesTable,
            IndexName: imageIdIndex,
            Key: { accountId: accountId, imageId: imageId },
            UpdateExpression: "set caption = :caption, #na = :url, is_published=:is_published, updatedAt = :updatedAt",
            ExpressionAttributeNames: {
                "#na": "url"
            },
            ExpressionAttributeValues: {
                ":caption": updatedImage.caption,
                ":url": updatedImage.url,
                ":updatedAt": updatedImage.updatedAt,
                ":is_published": updatedImage.is_published
            }
        }
        await this.docClient.update(params).promise()
    }

    async addAttachment(accountId: string, imageId: string, url: string) {
        const params = {
            TableName: this.imagesTable,
            Key: { accountId: accountId, imageId: imageId },
            UpdateExpression: "set #na = :url",
            ExpressionAttributeNames: {
                "#na": "url"
            },
            ExpressionAttributeValues: {
                ":url": url
            }
        }
        await this.docClient.update(params).promise()
    }

    async imageExists(accountId: string, imageId: string) {
        logger.info({ accountId: accountId, imageId: imageId })
        const result = await this.docClient
            .get({
                TableName: this.imagesTable,
                Key: { accountId: accountId,
                       imageId: imageId }
            })
            .promise()

        logger.info('Get Image: ' + JSON.stringify(result))
        return !!result.Item
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.info('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
