import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import { createLogger } from '../../utils/logger'
const logger = createLogger('elasticsearch')

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
    hosts: [esHost],
    connectionClass: httpAwsEs
})

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    logger.info('Processing events batch from DynamoDB' + JSON.stringify(event))

    for (const record of event.Records) {
        logger.info('Processing record' + JSON.stringify(record))
        if (record.eventName !== 'INSERT') {
            continue
        }

        const newItem = record.dynamodb.NewImage

        const accountId = newItem.id.S

        const body = {
            accountId: newItem.id.S,
            name: newItem.name.S,
        }

        await es.index({
            index: 'accounts-index',
            type: 'accounts',
            id: accountId,
            body
        })

    }
}
