import firebase from 'firebase/compat/app'
import Timestamp = firebase.firestore.Timestamp

export type Project = {
    id: string
    name: string
    owner: string
    setupType: string
    organizationId?: string
    createdAt: Timestamp
    voteStartTime?: string
}

export type ProjectExtraInfo = {
    dateCreated: string
    dateVote: string
    voteCount: number
    speakerCount: number
    link: string
}
