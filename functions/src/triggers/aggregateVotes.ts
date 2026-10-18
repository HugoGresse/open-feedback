import * as admin from 'firebase-admin'
import { Vote, VoteData, VOTE_STATUS_DELETED } from './models/vote'
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
        const firestoreDb = admin.firestore()
        // Applied one after the other, both may change the same talk
        return getVoteUpdates(
            new Vote(change.before.id, normalizeVoteTimestamps(change.before)),
            new Vote(change.after.id, normalizeVoteTimestamps(change.after))
        ).reduce<Promise<unknown>>(
            (previous, vote) =>
                previous.then(() => incrementVoteAggregate(firestoreDb, vote)),
            Promise.resolve()
        )
    }
)

/**
 * The votes to aggregate for an update of a user vote, from its state before
 * and after. Every client write changes the document (updatedAt), so an
 * update that changes neither the status nor what the vote targets is not
 * counted again, and a vote moved to another talk, item or text vote is
 * removed from its previous one.
 */
export const getVoteUpdates = (before: Vote, after: Vote): Vote[] => {
    const isSameTarget =
        before.voteData.talkId === after.voteData.talkId &&
        before.voteData.voteItemId === after.voteData.voteItemId &&
        before.voteData.voteId === after.voteData.voteId &&
        before.voteData.voteType === after.voteData.voteType
    if (!isSameTarget) {
        const removedVote = new Vote(before.id, {
            ...before.voteData,
            status: VOTE_STATUS_DELETED,
        })
        return [
            ...(before.isActive() ? [removedVote] : []),
            ...(after.isActive() ? [after] : []),
        ]
    }
    if (before.voteData.status !== after.voteData.status) {
        return [after]
    }
    // Same status: only the edit of an active text vote changes the results
    if (after.isActive() && after.isTextVoteItem() && !after.isTextPlusVote()) {
        return [after]
    }
    return []
}

// Gen2 (Eventarc) triggers can fire before a serverTimestamp() sentinel
// resolves, leaving createdAt/updatedAt null in the snapshot. The Gen1 API
// hid that intermediate write. Fall back to the snapshot's server-assigned
// createTime/updateTime so the aggregated sessionVotes doc never stores a
// null timestamp (which crashes the Feedback app's .toDate() calls).
export const normalizeVoteTimestamps = (
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
                vote.getVoteItemIncrementAggregation(aggregatedVote),
                { merge: true }
            )
        })
        .catch((err) => {
            console.log('Error getting documents talk', err)
            return err
        })
}
