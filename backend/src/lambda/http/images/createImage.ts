import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateImageRequest } from '../../../requests/images/CreateImageRequest'
import { createImage } from '../../../businessLogic/images'
import { getAccountId } from '../../utils'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('createImage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ' + JSON.stringify(event))
    const newImage: CreateImageRequest = JSON.parse(event.body)
    const accountId = getAccountId(event)
    const newItem = await createImage(accountId, newImage)

    logger.info('Creating images: ' + JSON.stringify(newItem))

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            image: newItem
        })
    }
}
