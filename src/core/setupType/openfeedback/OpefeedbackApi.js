import { fireStoreMainInstance, serverTimestamp } from '../../../firebase'
import { convertSnapshotToMap } from '../../../utils/firebaseUtils'

class OpenfeedbackApi {
    constructor(projectId) {
        this.projectId = projectId
    }

    firestoreProject() {
        return fireStoreMainInstance.collection('projects').doc(this.projectId)
    }

    getSessions() {
        return this.firestoreProject()
            .collection('talks')
            .get()
            .then(talksSnapshot => convertSnapshotToMap(talksSnapshot))
    }

    getSession(sessionId) {
        return this.firestoreProject()
            .collection('talks')
            .doc(sessionId)
            .get()
            .then(talkDoc => ({
                [talkDoc.id]: {
                    id: talkDoc.id,
                    ...talkDoc.data(),
                },
            }))
    }

    getSpeakers() {
        return this.firestoreProject()
            .collection('speakers')
            .get()
            .then(talksSnapshot => convertSnapshotToMap(talksSnapshot))
    }

    addSession(newSession) {
        return this.firestoreProject()
            .collection('talks')
            .add({
                ...newSession,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            .then(docRef => docRef.id)
    }

    removeSession(sessionId) {
        return this.firestoreProject()
            .collection('talks')
            .doc(sessionId)
            .delete()
    }

    editSession(session) {
        return this.firestoreProject()
            .collection('talks')
            .doc(session.id)
            .set(
                {
                    ...session,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            )
    }

    addSpeaker(speaker) {
        return this.firestoreProject()
            .collection('speakers')
            .add({
                ...speaker,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            .then(docRef => docRef.id)
    }

    removeSpeaker(speakerId) {
        return this.firestoreProject()
            .collection('speakers')
            .doc(speakerId)
            .delete()
    }

    editSpeaker(speaker) {
        return this.firestoreProject()
            .collection('speakers')
            .doc(speaker.id)
            .set(
                {
                    ...speaker,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            )
    }

    isReadOnly() {
        return false
    }
}

export default OpenfeedbackApi
