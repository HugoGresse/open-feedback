import { fireStoreMainInstance, serverTimestamp } from '../../../firebase.ts'
import { convertSnapshotToMap } from '../../../utils/firebaseUtils'

class OpenfeedbackApi {
    constructor(projectId) {
        this.projectId = projectId
    }

    firestoreProject() {
        return fireStoreMainInstance.collection('projects').doc(this.projectId)
    }

    getTalks() {
        return this.firestoreProject()
            .collection('talks')
            .get()
            .then((talksSnapshot) => convertSnapshotToMap(talksSnapshot))
    }

    getTalk(talkId) {
        return this.firestoreProject()
            .collection('talks')
            .doc(talkId)
            .get()
            .then((talkDoc) => ({
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
            .then((talksSnapshot) => convertSnapshotToMap(talksSnapshot))
    }

    addTalk(newTalk) {
        return this.firestoreProject()
            .collection('talks')
            .add({
                ...newTalk,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            .then((docRef) => docRef.id)
    }

    removeTalk(talkId) {
        return this.firestoreProject().collection('talks').doc(talkId).delete()
    }

    editTalk(talk) {
        return this.firestoreProject()
            .collection('talks')
            .doc(talk.id)
            .set(
                {
                    ...talk,
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
            .then((docRef) => docRef.id)
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
