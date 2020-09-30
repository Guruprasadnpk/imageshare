import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { PublishImageRequest } from '../../../requests/images/PublishImageRequest'
import { publishImage, imageExists } from '../../../businessLogic/images'
import { getAccountId } from '../../utils'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('publishImage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Publishing image")
    const imageId = event.pathParameters.imageId
    const publishedImage: PublishImageRequest = JSON.parse(event.body)

    const accountId = getAccountId(event)
    const validImageId = await imageExists(accountId, imageId)

    if (!validImageId) {
        logger.error('Image does not exist')
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Todo does not exist'
            })
        }
    }

    await publishImage(accountId, imageId, publishedImage)
    logger.info('Publishing ' + imageId + ' with: ' + JSON.stringify(publishedImage))

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    }
}
