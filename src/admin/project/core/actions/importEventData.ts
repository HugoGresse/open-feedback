import type firebase from 'firebase/compat/app'
import { fireStoreMainInstance, serverTimestamp } from '../../../../firebase'
import {
    EventData,
    normalizeEventData,
} from '../../../../core/setupType/eventDataNormalization'
// @ts-expect-error - JS module without types
import { addNotification } from '../../../notification/notifcationActions'

// Firestore caps a write batch at 500 operations; stay under it.
const BATCH_LIMIT = 450

interface ImportSummary {
    talkCount: number
    speakerCount: number
}

interface WriteOp {
    ref: firebase.firestore.DocumentReference
    data: Record<string, unknown>
}

// A Firestore document id cannot be empty nor contain a slash (it would be
// read as a sub-path). Validate up front so a bad id from the imported JSON
// produces a clear error rather than throwing synchronously mid-import.
const isValidDocId = (id: string): boolean =>
    typeof id === 'string' && id.length > 0 && !id.includes('/')

const assertValidIds = (ids: string[], kind: string): void => {
    const invalid = ids.filter((id) => !isValidDocId(id))
    if (invalid.length > 0) {
        throw new Error(
            `Invalid ${kind} id(s) (empty or containing "/"): ${invalid
                .slice(0, 5)
                .join(', ')}`
        )
    }
}

const commitInBatches = async (ops: WriteOp[]): Promise<void> => {
    for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
        const batch = fireStoreMainInstance.batch()
        ops.slice(i, i + BATCH_LIMIT).forEach(({ ref, data }) => {
            batch.set(ref, data, { merge: true })
        })
        await batch.commit()
    }
}

// Write the talks and speakers from an imported JSON event blob into the
// project's Firestore subcollections, using the JSON ids as document ids so
// that session.speakers references stay valid. The project itself is created
// as a regular openfeedbackv1 event, so everything is editable afterwards.
export const importEventData =
    (projectId: string, rawData: EventData) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (dispatch: any): Promise<ImportSummary> => {
        try {
            const data = normalizeEventData(rawData)
            const projectRef = fireStoreMainInstance
                .collection('projects')
                .doc(projectId)

            const speakers = Object.values(data.speakers || {})
            const sessions = Object.values(data.sessions || {})

            assertValidIds(
                speakers.map((s) => s.id),
                'speaker'
            )
            assertValidIds(
                sessions.map((s) => s.id),
                'talk'
            )

            const speakerOps: WriteOp[] = speakers.map((speaker) => ({
                ref: projectRef.collection('speakers').doc(speaker.id),
                data: {
                    ...speaker,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                },
            }))

            const talkOps: WriteOp[] = sessions.map((session) => ({
                ref: projectRef.collection('talks').doc(session.id),
                data: {
                    ...session,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                },
            }))

            // Speakers first so talk.speakers references resolve immediately.
            await commitInBatches(speakerOps)
            await commitInBatches(talkOps)

            return {
                talkCount: talkOps.length,
                speakerCount: speakerOps.length,
            }
        } catch (err) {
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'project.importFail',
                    message: (err as Error).toString(),
                })
            )
            throw err
        }
    }
