import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Vote, VoteData } from './models/vote'
import { firestoreIncrement } from '../helpers/firebaseInit'

export const aggregateVotesCreate = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onCreate(snapshot => {
        return incrementVoteAggregate(
            admin.firestore(),
            new Vote(snapshot.id, snapshot.data() as VoteData)
        )
    })

export const aggregateVotesUpdate = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onUpdate(change => {
        return incrementVoteAggregate(
            admin.firestore(),
            new Vote(change.after.id, change.after.data() as VoteData)
        )
    })

export const incrementVoteAggregate = (
    firestoreDb: FirebaseFirestore.Firestore,
    vote: Vote
) => {
    if (!vote || !vote.isValid()) {
        console.error('newVotes ids are not valid', JSON.stringify(vote))
        return
    }

    const talkVoteDb = firestoreDb
        .collection('projects')
        .doc(vote.voteData.projectId)
        .collection('sessionVotes')
        .doc(String(vote.voteData.talkId))

    return talkVoteDb
        .get()
        .then(snapshot => {
            const talk = snapshot.data()

            if (vote.isTextVote()) {
                let aggregatedValue
                const voteText = {
                    text: vote.voteData.text,
                    createdAt: vote.voteData.createdAt,
                    updatedAt: vote.voteData.updatedAt,
                    userId: vote.voteData.userId,
                }
                if (vote.isActive()) {
                    if (
                        !snapshot.exists ||
                        !talk ||
                        !talk[vote.voteData.voteItemId]
                    ) {
                        aggregatedValue = { [vote.id]: voteText }
                    } else {
                        aggregatedValue = {
                            ...talk[vote.voteData.voteItemId],
                            [vote.id]: voteText,
                        }
                    }
                } else {
                    if (
                        !snapshot.exists ||
                        !talk ||
                        !talk[vote.voteData.voteItemId]
                    ) {
                        aggregatedValue = {}
                    } else {
                        aggregatedValue = talk[vote.voteData.voteItemId]
                        aggregatedValue[vote.id] = {}
                    }
                }

                return talkVoteDb.set(
                    {
                        [vote.voteData.voteItemId]: aggregatedValue,
                    },
                    { merge: true }
                )
            }

            // Boolean vote
            return talkVoteDb.set(
                {
                    [vote.voteData.voteItemId]: firestoreIncrement(
                        vote.getIncrementValue()
                    ),
                },
                { merge: true }
            )
        })
        .catch(err => {
            console.log('Error getting documents talk', err)
            return err
        })
}
