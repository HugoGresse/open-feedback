import { fireStoreMainInstance, serverTimestamp } from '../../../firebase.ts'
import { convertSnapshotToMap } from '../../../utils/firebaseUtils'
import type {
    NewSpeaker,
    NewTalk,
    Speaker,
    SpeakersMap,
    Talk,
    TalksMap,
} from '../../models'
import type { ProjectApi } from '../projectApi'

export class OpenfeedbackApi implements ProjectApi {
    projectId: string

    constructor(projectId: string) {
        this.projectId = projectId
    }

    firestoreProject() {
        return fireStoreMainInstance.collection('projects').doc(this.projectId)
    }

    getTalks(): Promise<TalksMap> {
        return this.firestoreProject()
            .collection('talks')
            .get()
            .then((talksSnapshot) => convertSnapshotToMap<Talk>(talksSnapshot))
    }

    getTalk(talkId: string): Promise<TalksMap> {
        return this.firestoreProject()
            .collection('talks')
            .doc(talkId)
            .get()
            .then((talkDoc) =>
                // An unknown id resolves to no talk instead of a talk without data
                talkDoc.exists
                    ? {
                          [talkDoc.id]: {
                              id: talkDoc.id,
                              ...(talkDoc.data() as NewTalk),
                          },
                      }
                    : {}
            )
    }

    getSpeakers(): Promise<SpeakersMap> {
        return this.firestoreProject()
            .collection('speakers')
            .get()
            .then((talksSnapshot) =>
                convertSnapshotToMap<Speaker>(talksSnapshot)
            )
    }

    addTalk(newTalk: NewTalk): Promise<string> {
        return this.firestoreProject()
            .collection('talks')
            .add({
                ...newTalk,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            .then((docRef) => docRef.id)
    }

    removeTalk(talkId: string): Promise<void> {
        return this.firestoreProject().collection('talks').doc(talkId).delete()
    }

    editTalk(talk: Talk): Promise<void> {
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

    addSpeaker(speaker: NewSpeaker): Promise<string> {
        return this.firestoreProject()
            .collection('speakers')
            .add({
                ...speaker,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            .then((docRef) => docRef.id)
    }

    removeSpeaker(speakerId: string): Promise<void> {
        return this.firestoreProject()
            .collection('speakers')
            .doc(speakerId)
            .delete()
    }

    editSpeaker(speaker: Speaker): Promise<void> {
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
