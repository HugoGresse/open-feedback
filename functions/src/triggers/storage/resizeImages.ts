import * as functions from 'firebase-functions'
import * as gcs from '@google-cloud/storage'
import path from 'path'
import sharp from 'sharp'

const IMAGE_SIZES: { w: number; h: number }[] = [
    {
        w: 120,
        h: 120,
    },
    {
        w: 240,
        h: 240,
    },
    {
        w: 512,
        h: 512,
    },
]

const THUMB_PREFIX = 'thumb!_'

/**
 * Upon image upload on Firebase Storage, we generate 3 reduced sizes:
 * - 120x120px
 * - 240x240px
 * - 512x512px
 *
 * This also reduce the image sizes
 */
export const resizeImages = functions.storage.object().onFinalize(object => {
    const fileBucket = object.bucket // The Storage bucket that contains the file.
    const filePath = object.name // File path in the bucket.
    const contentType = object.contentType // File content type.

    // Exit if this is triggered on a file that is not an image.
    if (!contentType || !contentType.startsWith('image/')) {
        console.log('This is not an image.')
        return null
    }

    if (!filePath) {
        console.log('No filepath.')
        return null
    }

    // Get the file name.
    const fileName = path.basename(filePath)
    // Exit if the image is already a thumbnail.
    if (fileName.startsWith(THUMB_PREFIX)) {
        console.log('Already a Thumbnail.')
        return null
    }

    // Download file from bucket.
    // @ts-ignore
    const bucket = gcs.bucket(fileBucket)

    const metadata = {
        contentType: contentType,
    }
    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFileName = `${THUMB_PREFIX}_${fileName}`
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName)
    // Create write stream for uploading thumbnail
    const thumbnailUploadStream = bucket
        .file(thumbFilePath)
        .createWriteStream({ metadata })

    // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream
    const pipeline = sharp()

    for (const imageSize of IMAGE_SIZES) {
        pipeline.resize(imageSize.w, imageSize.h).pipe(thumbnailUploadStream)
    }

    bucket
        .file(filePath)
        .createReadStream()
        .pipe(pipeline)

    return new Promise((resolve, reject) =>
        thumbnailUploadStream.on('finish', resolve).on('error', reject)
    )
})
