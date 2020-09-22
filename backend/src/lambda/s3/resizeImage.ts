import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import axios from 'axios'
const sharp = require('sharp')

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3()

const imagesBucketName = process.env.ATTACHMENTS_S3_BUCKET

export const handler: SNSHandler = async (event: SNSEvent) => {
    console.log('Processing SNS event ', JSON.stringify(event))
    for (const snsRecord of event.Records) {
        const s3EventStr = snsRecord.Sns.Message
        console.log('Processing S3 event', s3EventStr)
        const s3Event = JSON.parse(s3EventStr)
        const fs = require('fs');
        fs.readdirSync('/opt/node_modules/sharp').forEach(file => {
            console.log(file);
        });
        for (const record of s3Event.Records) {
            await processImage(record)
        }
    }
}

async function processImage(record: S3EventRecord) {
    const key = record.s3.object.key
    if (key.startsWith('raw/')) {
        console.log('Processing S3 item with key: ', key)
        const attachmentURL = `https://${imagesBucketName}.s3.amazonaws.com/${key}`
        console.log('Reading image from: ', attachmentURL)
        const response = await axios({ url: attachmentURL, responseType: "arraybuffer" })
        const img_buffer = Buffer.from(response.data, 'binary')

        const input = sharp(img_buffer)
        const resized_img = input.resize(250, 350);
        const convertedBuffer = await resized_img.toBuffer()
        console.log(`Writing image back to S3 bucket: ${imagesBucketName}`)
        const thumbnail_name = key.replace('raw', 'thumbnail')
        await s3
            .putObject({
                Bucket: imagesBucketName,
                Key: `${thumbnail_name}`,
                Body: convertedBuffer
            })
            .promise()
    }
}
