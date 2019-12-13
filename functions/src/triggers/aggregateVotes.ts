import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as firebase from 'firebase'
import DocumentData = firebase.firestore.DocumentData

export const aggregateVotesCreate = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onCreate(snapshot => {
        return incrementVoteAggregate(
            admin.firestore(),
            snapshot.id,
            snapshot.data(),
            +1
        )
    })

export const aggregateVotesDelete = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onDelete(snapshot => {
        return incrementVoteAggregate(
            admin.firestore(),
            snapshot.id,
            snapshot.data(),
            -1
        )
    })

export const aggregateVotesUpdate = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onUpdate(change => {
        return incrementVoteAggregate(
            admin.firestore(),
            change.after.id,
            change.after.data(),
            1
        )
    })

export const incrementVoteAggregate = (
    firestoreDb: FirebaseFirestore.Firestore,
    newVoteId: string,
    newVote: DocumentData | undefined,
    increment: number
) => {
    if (
        !newVote ||
        !isIdValid(newVote.projectId) ||
        !isIdValid(newVote.talkId) ||
        !isIdValid(newVote.voteItemId) ||
        !isIdValid(newVote.userId) ||
        !newVote.id
    ) {
        console.error('newVotes ids are not valid', newVote)
        return
    }

    const talkVoteDb = firestoreDb
        .collection('projects')
        .doc(newVote.projectId)
        .collection('sessionVotes')
        .doc(String(newVote.talkId))

    return talkVoteDb
        .get()
        .then(snapshot => {
            let aggregatedValue
            const talk = snapshot.data()

            if (newVote.text) {
                const voteText = {
                    text: newVote.text,
                    createdAt: newVote.createdAt,
                    updatedAt: newVote.updatedAt,
                    userId: newVote.userId,
                }
                if (increment > 0) {
                    if (
                        !snapshot.exists ||
                        !talk ||
                        !talk[newVote.voteItemId]
                    ) {
                        aggregatedValue = { [newVoteId]: voteText }
                    } else {
                        aggregatedValue = {
                            ...talk[newVote.voteItemId],
                            [newVoteId]: voteText,
                        }
                    }
                } else {
                    if (
                        !snapshot.exists ||
                        !talk ||
                        !talk[newVote.voteItemId]
                    ) {
                        aggregatedValue = {}
                    } else {
                        aggregatedValue = talk[newVote.voteItemId]
                        aggregatedValue[newVoteId] = {}
                    }
                }
            } else {
                if (!snapshot.exists || !talk || !talk[newVote.voteItemId]) {
                    aggregatedValue = increment
                } else {
                    aggregatedValue = talk[newVote.voteItemId] + increment
                }
            }

            return talkVoteDb.set(
                {
                    [newVote.voteItemId]: aggregatedValue,
                },
                { merge: true }
            )
        })
        .catch(err => {
            console.log('Error getting documents talk', err)
            return err
        })
}
const isIdValid = (id: any): boolean => {
    return id && id.length > 0
}
