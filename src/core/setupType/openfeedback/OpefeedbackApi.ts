import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore'
import { fireStoreMainInstance } from '../../../firebase.ts'
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
        return doc(fireStoreMainInstance, 'projects', this.projectId)
    }

    getTalks(): Promise<TalksMap> {
        return getDocs(collection(this.firestoreProject(), 'talks')).then(
            (talksSnapshot) => convertSnapshotToMap<Talk>(talksSnapshot)
        )
    }

    getTalk(talkId: string): Promise<TalksMap> {
        return getDoc(doc(this.firestoreProject(), 'talks', talkId)).then(
            (talkDoc) =>
                // An unknown id resolves to no talk instead of a talk without data
                talkDoc.exists()
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
        return getDocs(collection(this.firestoreProject(), 'speakers')).then(
            (talksSnapshot) => convertSnapshotToMap<Speaker>(talksSnapshot)
        )
    }

    addTalk(newTalk: NewTalk): Promise<string> {
        return addDoc(collection(this.firestoreProject(), 'talks'), {
            ...newTalk,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }).then((docRef) => docRef.id)
    }

    removeTalk(talkId: string): Promise<void> {
        return deleteDoc(doc(this.firestoreProject(), 'talks', talkId))
    }

    editTalk(talk: Talk): Promise<void> {
        return setDoc(
            doc(this.firestoreProject(), 'talks', talk.id),
            {
                ...talk,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        )
    }

    addSpeaker(speaker: NewSpeaker): Promise<string> {
        return addDoc(collection(this.firestoreProject(), 'speakers'), {
            ...speaker,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }).then((docRef) => docRef.id)
    }

    removeSpeaker(speakerId: string): Promise<void> {
        return deleteDoc(doc(this.firestoreProject(), 'speakers', speakerId))
    }

    editSpeaker(speaker: Speaker): Promise<void> {
        return setDoc(
            doc(this.firestoreProject(), 'speakers', speaker.id),
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
