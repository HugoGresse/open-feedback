import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Vote, VoteData } from './models/vote'
import { firestoreIncrement } from '../helpers/firebaseInit'
import { createTransactionCollisionAvoider } from '../helpers/transactionCollisionAvoider'
import { random } from '../helpers/random'
import DocumentReference = admin.firestore.DocumentReference

const shardCount = 5

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

/**
 * This aggregate the vote to be "easily" read afterward.
 * Aggregation is splitted in many shard per vote item to prevent transaction collision.
 * Each shard is a document inside a collection with only one "votes" field. This field is either the sum of some votes
 * (like votes: 5) or a map of text votes (like {id1: {text: "toto"}, id2: {text:"titi"}}.
 *
 * The base voteItem document inside the aggregateVotes collection need at least one field to be considered existing by
 * Firestore.
 * @param firestoreDb
 * @param vote
 */
export const incrementVoteAggregate = async (
    firestoreDb: FirebaseFirestore.Firestore,
    vote: Vote
) => {
    if (!vote || !vote.isValid()) {
        console.error('newVotes ids are not valid', JSON.stringify(vote))
        return
    }

    // TODO :
    // add migration script
    // Update dashboards

    const aggregatedTalkRef = firestoreDb
        .collection('projects')
        .doc(vote.voteData.projectId)
        .collection('aggregatedVotes')
        .doc(String(vote.voteData.talkId))

    await maybeCreateTalkAggregatedDocument(aggregatedTalkRef)

    const shardRef = aggregatedTalkRef
        .collection(vote.voteData.voteItemId)
        .doc(random(0, shardCount).toString())

    if (vote.isTextVote()) {
        return incrementTextVote(firestoreDb, shardRef, vote)
    }

    return incrementBooleanVote(firestoreDb, shardRef, vote)
}

const maybeCreateTalkAggregatedDocument = async (
    ref: DocumentReference
): Promise<any> => {
    const doc = await ref.get()
    if (doc.exists) {
        return Promise.resolve()
    }
    return ref.set(
        {
            shardCount: shardCount,
        },
        { merge: true }
    )
}

const incrementBooleanVote = (
    firestoreDb: FirebaseFirestore.Firestore,
    shardRef: DocumentReference,
    vote: Vote
) => {
    const batch = firestoreDb.batch()

    batch.set(
        shardRef,
        {
            votes: firestoreIncrement(vote.getIncrementValue()),
        },
        { merge: true }
    )

    return batch.commit()
}

const incrementTextVote = (
    firestoreDb: FirebaseFirestore.Firestore,
    shardRef: DocumentReference,
    vote: Vote
) => {
    const collisionAvoider = createTransactionCollisionAvoider()

    return firestoreDb.runTransaction(async transaction => {
        // If two many transaction are colliding, add delay before running it
        await collisionAvoider.avoidCollision()

        const snapshot = await transaction.get(shardRef)
        const talk = snapshot.data()

        let aggregatedValue
        const voteText = {
            text: vote.voteData.text,
            createdAt: vote.voteData.createdAt,
            updatedAt: vote.voteData.updatedAt,
            userId: vote.voteData.userId,
        }
        if (vote.isActive()) {
            if (!snapshot.exists || !talk || !talk[vote.voteData.voteItemId]) {
                aggregatedValue = { [vote.id]: voteText }
            } else {
                aggregatedValue = {
                    ...talk[vote.voteData.voteItemId],
                    [vote.id]: voteText,
                }
            }
        } else {
            if (!snapshot.exists || !talk || !talk[vote.voteData.voteItemId]) {
                aggregatedValue = {}
            } else {
                aggregatedValue = talk[vote.voteData.voteItemId]
                aggregatedValue[vote.id] = {}
            }
        }

        return transaction.set(
            shardRef,
            {
                votes: aggregatedValue,
            },
            { merge: true }
        )
    })
}
