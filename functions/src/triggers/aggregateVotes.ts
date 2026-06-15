import * as admin from 'firebase-admin'
import { Vote, VoteData } from './models/vote'
import {
    onDocumentCreated,
    onDocumentUpdated,
} from 'firebase-functions/v2/firestore'

export const aggregateVotesCreate = onDocumentCreated(
    '/projects/{projectId}/userVotes/{voteId}',
    (event) => {
        const snapshot = event.data
        if (!snapshot) {
            return
        }
        return incrementVoteAggregate(
            admin.firestore(),
            new Vote(snapshot.id, normalizeVoteTimestamps(snapshot))
        )
    }
)

export const aggregateVotesUpdate = onDocumentUpdated(
    '/projects/{projectId}/userVotes/{voteId}',
    (event) => {
        const change = event.data
        if (!change) {
            return
        }
        return incrementVoteAggregate(
            admin.firestore(),
            new Vote(change.after.id, normalizeVoteTimestamps(change.after))
        )
    }
)

// Gen2 (Eventarc) triggers can fire before a serverTimestamp() sentinel
// resolves, leaving createdAt/updatedAt null in the snapshot. The Gen1 API
// hid that intermediate write. Fall back to the snapshot's server-assigned
// createTime/updateTime so the aggregated sessionVotes doc never stores a
// null timestamp (which crashes the Feedback app's .toDate() calls).
const normalizeVoteTimestamps = (
    snapshot: FirebaseFirestore.DocumentSnapshot
): VoteData => {
    const data = snapshot.data() as VoteData
    return {
        ...data,
        createdAt: data.createdAt ?? snapshot.createTime ?? snapshot.updateTime,
        updatedAt: data.updatedAt ?? snapshot.updateTime ?? snapshot.createTime,
    }
}

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
