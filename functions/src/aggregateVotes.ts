import * as  functions from 'firebase-functions'
import * as firebase from "firebase"
import DocumentData = firebase.firestore.DocumentData
import {firestore} from "./firebaseInit"

export const aggregateVotesCreate = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onCreate((snapshot) => {
        return incrementVoteAggregate(firestore, snapshot.id, snapshot.data(), +1)
    })

export const aggregateVotesDelete = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onDelete((snapshot) => {
        return incrementVoteAggregate(firestore, snapshot.id, snapshot.data(), -1)
    })

export const aggregateVotesUpdate = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onUpdate((change) => {
        return incrementVoteAggregate(firestore, change.after.id, change.after.data(), 1)
    })



export const incrementVoteAggregate = (firestoreDb: FirebaseFirestore.Firestore, newVoteId: string, newVote: DocumentData | undefined, increment: number) => {
    if (
        !newVote ||
        !isIdValid(newVote.projectId) ||
        !isIdValid(newVote.sessionId) ||
        !isIdValid(newVote.voteItemId) ||
        !isIdValid(newVote.userId) ||
        !newVote.id
    ) {
        console.error('newVotes ids are not valid', newVote)
        return
    }

    const sessionVoteDb = firestoreDb
        .collection('projects')
        .doc(newVote.projectId)
        .collection('sessionVotes')
        .doc(String(newVote.sessionId))

    return sessionVoteDb
        .get()
        .then(snapshot => {
            let aggregatedValue
                const session = snapshot.data()

            if(!session){
                return Promise.reject('undefined session')
            }

            if (newVote.text) {
                const voteText = {
                    text: newVote.text,
                    createdAt: newVote.createdAt,
                    updatedAt: newVote.updatedAt,
                    userId: newVote.userId
                }
                if (increment > 0) {
                    if (!snapshot.exists || !session[newVote.voteItemId]) {
                        aggregatedValue = { [newVoteId]: voteText }
                    } else {
                        aggregatedValue = {
                            ...session[newVote.voteItemId],
                            [newVoteId]: voteText
                        }
                    }
                } else {
                    if (!snapshot.exists || !session[newVote.voteItemId]) {
                        aggregatedValue = {}
                    } else {
                        aggregatedValue = session[newVote.voteItemId]
                        aggregatedValue[newVoteId] = {}
                    }
                }
            } else {
                if (!snapshot.exists || !session[newVote.voteItemId]) {
                    aggregatedValue = increment
                } else {
                    aggregatedValue = session[newVote.voteItemId] + increment
                }
            }

            return sessionVoteDb.set(
                {
                    [newVote.voteItemId]: aggregatedValue
                },
                { merge: true }
            )
        })
        .catch(err => {
            console.log('Error getting documents session', err)
            return err
        })

}
const isIdValid = (id: any): boolean => {
    return id && id.length > 0
}
