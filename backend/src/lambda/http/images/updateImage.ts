import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateImageRequest } from '../../../requests/images/UpdateImageRequest'
import { updateImage, imageExists } from '../../../businessLogic/images'
import { getAccountId } from '../../utils'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('updateImage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Updating image")
    const imageId = event.pathParameters.imageId
    const updatedImage: UpdateImageRequest = JSON.parse(event.body)

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

    await updateImage(accountId, imageId, updatedImage)
    logger.info('Updating ' + imageId + ' with: ' + JSON.stringify(updatedImage))

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    }
}
