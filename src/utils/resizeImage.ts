import imageBlobReduce from 'image-blob-reduce'

/**
 * Resize image
 * @param {File} file
 * @param {number} maxSize - Max size in px
 * @returns {Promise<Blob>}
 */
export const resizeImage = async (file: File, maxSize = 500): Promise<Blob> => {
    switch (file.type) {
        case 'image/svg+xml':
            return file
        default: {
            const reduce = imageBlobReduce()
            return await reduce.toBlob(file, { max: maxSize })
        }
    }
}
