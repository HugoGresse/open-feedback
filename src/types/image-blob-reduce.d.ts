declare module 'image-blob-reduce' {
    export interface ImageBlobReduceOptions {
        max?: number
    }

    export interface ImageBlobReduce {
        toBlob(blob: Blob, options?: ImageBlobReduceOptions): Promise<Blob>
    }

    export default function imageBlobReduce(): ImageBlobReduce
}
