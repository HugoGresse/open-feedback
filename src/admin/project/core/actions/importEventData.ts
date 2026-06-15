import firebase from 'firebase/compat/app'
import { fireStoreMainInstance, serverTimestamp } from '../../../../firebase'
import {
    EventData,
    normalizeEventData,
} from '../../../../core/setupType/eventDataNormalization'

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
    async (): Promise<ImportSummary> => {
        const data = normalizeEventData(rawData)
        const projectRef = fireStoreMainInstance
            .collection('projects')
            .doc(projectId)

        const speakers = Object.values(data.speakers || {})
        const sessions = Object.values(data.sessions || {})

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
    }
