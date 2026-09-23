import { App as FirebaseApp } from 'firebase-admin/app'

// Event fields that hold an uploaded image URL.
const IMAGE_FIELDS = ['favicon', 'logoSmall'] as const

type StorageObject = { bucket: string; path: string }

/**
 * Extracts the bucket and object path from the URL formats the admin UI
 * stores (see src/admin/project/utils/storage/uploadImage.js):
 *  - public URL: https://storage.googleapis.com/{bucket}/{path}
 *  - download URL (also used with emulators):
 *    https://{host}/v0/b/{bucket}/o/{encodedPath}?alt=media&token=...
 */
export const parseStorageUrl = (value: unknown): StorageObject | null => {
    if (typeof value !== 'string') {
        return null
    }
    let url: URL
    try {
        url = new URL(value)
    } catch {
        return null
    }
    if (url.hostname === 'storage.googleapis.com') {
        const [, bucket, ...path] = url.pathname.split('/')
        return bucket && path.length
            ? { bucket, path: decodeURIComponent(path.join('/')) }
            : null
    }
    const match = url.pathname.match(/^\/v0\/b\/([^/]+)\/o\/([^/]+)$/)
    return match
        ? { bucket: match[1], path: decodeURIComponent(match[2]) }
        : null
}

/**
 * Returns the storage paths of images replaced by an update that can safely
 * be deleted: only files uploaded for this event (projects/{projectId}/...)
 * in the given bucket, and never a file still referenced after the update.
 * Organization images (organizations/{orgId}/...) are inherited by several
 * events, so they are never deleted from here.
 */
export const findReplacedEventImages = (
    projectId: string,
    bucket: string,
    before: Record<string, unknown>,
    after: Record<string, unknown>
): string[] => {
    const stillUsed = new Set(IMAGE_FIELDS.map((field) => after[field]))
    const paths = IMAGE_FIELDS.filter((field) => before[field] !== after[field])
        .map((field) => before[field])
        .filter((url) => !stillUsed.has(url))
        .map(parseStorageUrl)
        .filter(
            (object): object is StorageObject =>
                object !== null &&
                object.bucket === bucket &&
                // Exactly one segment below the event folder, as enforced by
                // the storage rules (projects/{projectId}/{imageId}).
                object.path.startsWith(`projects/${projectId}/`) &&
                /^[^/]+$/.test(
                    object.path.slice(`projects/${projectId}/`.length)
                )
        )
        .map((object) => object.path)
    return [...new Set(paths)]
}

/**
 * Best-effort cleanup of images replaced by an event update, mirroring the
 * admin UI (deleteOldFilesIfNewValueDiffer). Never fails the request: the
 * update is already committed, a leftover file only costs storage.
 */
export const deleteReplacedEventImages = async (
    firebaseApp: FirebaseApp,
    projectId: string,
    before: Record<string, unknown>,
    after: Record<string, unknown>
) => {
    if (IMAGE_FIELDS.every((field) => before[field] === after[field])) {
        return
    }
    try {
        // Loaded lazily: only updates that replace an image need Storage.
        const { getStorage } = await import('firebase-admin/storage')
        const bucket = getStorage(firebaseApp).bucket()
        const paths = findReplacedEventImages(
            projectId,
            bucket.name,
            before,
            after
        )
        await Promise.all(
            paths.map((path) =>
                bucket
                    .file(path)
                    .delete({ ignoreNotFound: true })
                    .catch((error: unknown) => {
                        console.warn(
                            `Failed to delete replaced image ${path} of event ${projectId}:`,
                            error
                        )
                    })
            )
        )
    } catch (error) {
        // e.g. no default bucket configured (standalone dev server).
        console.warn(
            `Skipped replaced image cleanup for event ${projectId}:`,
            error
        )
    }
}
