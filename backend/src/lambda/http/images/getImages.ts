import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllImages } from '../../../businessLogic/images'
import { getAccountId } from '../../utils'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('getImage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ' + JSON.stringify(event))

    const accountId = getAccountId(event)
    const images = await getAllImages(accountId)
    logger.info('Get all images of the account: ' + JSON.stringify(images))
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
