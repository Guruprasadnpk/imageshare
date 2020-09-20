import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getPublishedImages } from '../../../businessLogic/images'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('getPublishedImages')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ' + JSON.stringify(event))

    const images = await getPublishedImages()
    logger.info('Get all the published images: ' + JSON.stringify(images))
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            images
        })
    }
}
