# Imageshare

Simple Imageshare application using AWS Lambda and Serverless framework. 

# Functionality of the application

This application will allow creating/removing/updating/fetching Image items. Each Image item has an attachment image and a thumbnail image. The home page lists all the images published by the users and once logged in each user has access to create/delete/publish images.

# ImageShare items

The application stores Image items, and each Image item contains the following fields:

* `imageId` (string) - a unique id for an item
* `accountId` (string) - an id for the user who uploaded the image
* `createdAt` (string) - date and time when an item was created
* `caption` (string) - name of a Image item (e.g. "Dog")
* `updatedAt` (string) - date and time when an item was last updated
* `is_published` (integer) - 1 if an image was published to public view, 0 otherwise
* `urls` (object)
* `urls.raw` (object) (optional) - a URL pointing to an image attached to a Image item
* `urls.thumb` (object) (optional) - a URL pointing to an thumbnail of the image attached to a Image item


# Functions implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function implements a custom authorizer for API Gateway that has be added to all other functions.


* `CreateImage` - Creates an Image for a current user. A user id is extracted from a JWT token that is sent by the frontend

It receives an object that contains four fields:
```json
    {
        "caption": "Dog 1",
        "createdAt": "2020-09-19T20:20:39+00:00",
        "updatedAt": "2020-09-19T20:20:39+00:00",
        "is_published": 0
    }
```

It returns data that looks like this:

```json
    {
        "image": {
            "imageId": "e4a8cfde-4767-41b6-a40e-228ca2d995d7",
            "accountId": "google-oauth2|111870641119754504063",
            "caption": "Dog 1",
            "createdAt": "2020-09-19T20:20:39+00:00",
            "updatedAt": "2020-09-19T20:20:39+00:00",
            "is_published": 0
        }
    }
```

* `GetImages` - returns all Images for a current user. A user id is extracted from a JWT token that is sent by the frontend

It returns data that looks like this:

```json
{
"images": [
        {
            "urls": {
                "raw": "https://serverless-imageshare-guru-attachments-dev.s3.amazonaws.com/raw/5d9bf148-30b8-4124-b93b-2a9ac9c6bc9d",
                "thumb": "https://serverless-imageshare-guru-attachments-dev.s3.amazonaws.com/thumbnail/5d9bf148-30b8-4124-b93b-2a9ac9c6bc9d"
            },
            "imageId": "fa29f0d6-689c-4f56-ac9c-6ff97977f458",
            "accountId": "google-oauth2|111870641119754504063",
            "caption": "Image 0",
            "updatedAt": "1969-12-31T16:00:00+00:00",
            "is_published": 0,
            "createdAt": "2020-10-02T14:01:28+00:00"
        },
        {
            "urls": {
                "raw": "https://serverless-imageshare-guru-attachments-dev.s3.amazonaws.com/raw/d60b2a8e-113f-44ef-882f-9c22c5dfc953",
                "thumb": "https://serverless-imageshare-guru-attachments-dev.s3.amazonaws.com/thumbnail/d60b2a8e-113f-44ef-882f-9c22c5dfc953"
            },
            "imageId": "1b98cb8a-a5f8-4b38-9795-579dd4e0a1ff",
            "accountId": "google-oauth2|111870641119754504063",
            "caption": "Image 1",
            "updatedAt": "1969-12-31T16:00:00+00:00",
            "is_published": 1,
            "createdAt": "2020-10-02T14:01:33+00:00"
        }]   
    }
```

* `GetPublishedImages` - returns all Images for published by all the users. 

```json
{
"images": [
        {
            "urls": {
                "raw": "https://serverless-imageshare-guru-attachments-dev.s3.amazonaws.com/raw/5d9bf148-30b8-4124-b93b-2a9ac9c6bc9d",
                "thumb": "https://serverless-imageshare-guru-attachments-dev.s3.amazonaws.com/thumbnail/5d9bf148-30b8-4124-b93b-2a9ac9c6bc9d"
            },
            "imageId": "fa29f0d6-689c-4f56-ac9c-6ff97977f458",
            "accountId": "google-oauth2|111870641119754504063",
            "caption": "Image 0",
            "updatedAt": "1969-12-31T16:00:00+00:00",
            "is_published": 1,
            "createdAt": "2020-10-02T14:01:28+00:00"
        },
        {
            "urls": {
                "raw": "https://serverless-imageshare-guru-attachments-dev.s3.amazonaws.com/raw/d60b2a8e-113f-44ef-882f-9c22c5dfc953",
                "thumb": "https://serverless-imageshare-guru-attachments-dev.s3.amazonaws.com/thumbnail/d60b2a8e-113f-44ef-882f-9c22c5dfc953"
            },
            "imageId": "1b98cb8a-a5f8-4b38-9795-579dd4e0a1ff",
            "accountId": "google-oauth2|111870641119754504063",
            "caption": "Image 1",
            "updatedAt": "1969-12-31T16:00:00+00:00",
            "is_published": 1,
            "createdAt": "2020-10-02T14:01:33+00:00"
        }]   
    }
```

* `UpdateImage` - Updates an Image item created by a current user. A shape of data send by a client application to this function can be found in the `ImageUpdate.ts` file

It receives an object that contains four fields that are updated in a Image item:

```json
{
    "caption": "Dog 1",
    "urls": {
        "raw": "https://serverless-imageshare-guru-attachments-dev.s3.amazonaws.com/raw/328b82e6-9498-4bf3-b7ab-45079b06e80c",
        "thumb": "https://serverless-imageshare-guru-attachments-dev.s3.amazonaws.com/thumbnail/328b82e6-9498-4bf3-b7ab-45079b06e80c"
    },
    "updatedAt": "2020-09-19T20:20:39+00:00",
    "is_published": 0
}
```

* `PublishImage` - Updates an Image item created by a current user. A shape of data send by a client application to this function can be found in the `ImageUpdate.ts` file

It receives an object that contains two fields that are updated in a Image item:

```json
{
    "updatedAt": "2020-09-19T20:20:39+00:00",
    "is_published": 0
}
```

The id of an item that has to be updated is passed as a URL parameter.

It returns an empty body.

* `DeleteImage` - Deletes an Image item created by a current user. Expects an id of a Image item to remove.

It returns an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a Image item.

It returns a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

Any necessary resources are added to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.

# Frontend

The `client` folder contains a web application that uses the API that should be developed in the project.

This frontend works with your serverless application once it is developed. The only file that you need to edit is the `config.ts` file in the `client` folder. This file is configured to the client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Imageshare application.
