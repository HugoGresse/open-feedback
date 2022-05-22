import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Vote, VoteData } from './models/vote'

export const aggregateVotesCreate = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onCreate((snapshot) => {
        return incrementVoteAggregate(
            admin.firestore(),
            new Vote(snapshot.id, snapshot.data() as VoteData)
        )
    })

export const aggregateVotesUpdate = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onUpdate((change) => {
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
        .then((snapshot) => {
            const aggregatedVote = snapshot.data()

            return talkVoteDb.set(
                vote.getVoteItemIncrementAggregation(
                    snapshot.exists,
                    aggregatedVote
                ),
                { merge: true }
            )
        })
        .catch((err) => {
            console.log('Error getting documents talk', err)
            return err
        })
}
