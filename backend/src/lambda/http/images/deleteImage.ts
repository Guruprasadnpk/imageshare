import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteImage, imageExists} from '../../../businessLogic/images'
import { getAccountId } from '../../utils'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('deleteImage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const imageId = event.pathParameters.imageId
    logger.info('Deleting image item:' + imageId)
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
                error: 'Image does not exist'
            })
        }
    }

    await deleteImage(accountId, imageId)
    logger.info('Deleted image item:' + imageId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: ''
    }
}
