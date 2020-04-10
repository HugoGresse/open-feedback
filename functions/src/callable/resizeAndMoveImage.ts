import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import path from 'path'
import sharp from 'sharp'
import { checkWriteToProjectAllowed } from '../helpers/checkWriteToProjectAllowed'
import stream from 'stream'
import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminJpegtran from 'imagemin-jpegtran'
import { HttpsError } from 'firebase-functions/lib/providers/https'
import { Bucket, File } from '@google-cloud/storage'

/**
 * Upon calling this function with a given file path on GCP Storage, it will resize and move the image to project dir
 * while ensuring permission is ok, resize the image, minifing/compressing the image, deleting original image.
 */
export const resizeAndMoveImage = functions.https.onCall(
    async (data, context) => {
        await checkWriteToProjectAllowed(context, data.projectId)

        const tempStoragePath = data.storageFullPath
        if (!tempStoragePath || tempStoragePath.length <= 0) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Missing required parameters.'
            )
        }

        const bucket = admin.storage().bucket()

        const [file, fileName] = await resize(
            bucket,
            tempStoragePath,
            data.width,
            data.height
        )
        const [newFile] = await moveToFinalDir(
            bucket,
            file,
            fileName,
            data.projectId
        )
        return encodeURI(await makePublicAndGetUrl(newFile))
    }
)

/**
 * It:
 * 1. Resize the image directly from a GCP read stream to a 500x500 keeping the aspect ratio
 * 2. Create a temp Writable stream to transform it to buffer
 * 3. Compress the image using 'imagemin'
 * 4. Save it to GCP back
 * 5. Delete original image
 *
 * @param filePath
 * @param width
 * @param height
 */
const resize = async (
    bucket: Bucket,
    filePath: string,
    width: number,
    height: number
): Promise<[File, string]> => {
    const ext = path.extname(filePath)
    const fileName = path.basename(filePath, ext)

    const [imageMetadata] = await bucket.file(filePath).getMetadata()

    const metadata = {
        contentType: imageMetadata.contentType,
        predefinedAcl: 'publicRead',
    }
    const newFileName = `${fileName}_${width}x${height}${ext}`
    const thumbFilePath = path.join(path.dirname(filePath), newFileName)
    const outputFile = bucket.file(thumbFilePath)

    const bufferData: any[] = []
    const tempWritableStream = new stream.Writable()
    tempWritableStream._write = function (chunk, encoding, done) {
        bufferData.push(chunk)
        done()
    }

    const pipeline = sharp()

    bucket.file(filePath).createReadStream().pipe(pipeline)

    pipeline
        .resize(width, height, { fit: 'inside' })
        .jpeg({ progressive: true, force: false })
        .png({ progressive: true, force: false })
        .pipe(tempWritableStream)

    return await new Promise((resolve, reject) =>
        tempWritableStream
            .on('finish', async () => {
                const transformedBuffer = await minimizeImageFromBufferArray(
                    bufferData
                )
                await saveImage(transformedBuffer, outputFile, metadata)
                await bucket.file(filePath).delete()
                resolve([outputFile, newFileName])
            })
            .on('error', reject)
    )
}

const moveToFinalDir = (
    bucket: Bucket,
    file: File,
    fileName: string,
    projectId: string
) => {
    const newFile = bucket.file(`uploads/${projectId}/${fileName}`)
    return file.move(newFile)
}

const makePublicAndGetUrl = async (file: File): Promise<string> => {
    await file.makePublic()
    return `https://${file.bucket.name}.storage.googleapis.com/${file.name}`
}

const minimizeImageFromBufferArray = (
    bufferArray: Buffer[]
): Promise<Buffer> => {
    return imagemin.buffer(Buffer.concat(bufferArray), {
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8],
            }),
        ],
    })
}

const saveImage = (inputBuffer: Buffer, file: File, metadata: {}) => {
    return new Promise((resolve, reject) => {
        file.save(
            inputBuffer,
            { metadata },
            (error: Error | null | undefined) => {
                if (error) {
                    reject(
                        new HttpsError(
                            'internal',
                            'Failed to write to output stream'
                        )
                    )
                }

                resolve()
            }
        )
    })
}
