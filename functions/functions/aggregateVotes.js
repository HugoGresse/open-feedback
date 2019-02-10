const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()

const aggregateVotesCreate = functions.firestore
    .document('/users/{userId}/votes/{voteId}')
    .onCreate((snapshot, context) => {
        return incrementVoteAggregate(
            snapshot.id,
            snapshot.data(),
            context.params.userId,
            +1
        )
    })

const aggregateVotesDelete = functions.firestore
    .document('/users/{userId}/votes/{voteId}')
    .onDelete((snapshot, context) => {
        return incrementVoteAggregate(
            snapshot.id,
            snapshot.data(),
            context.params.userId,
            -1
        )
    })

function incrementVoteAggregate(newVoteId, newVote, userId, increment) {
    if (
        !isIdValid(newVote.projectId) ||
        !isIdValid(newVote.sessionId) ||
        !isIdValid(newVote.voteItemId) ||
        !newVote.id
    ) {
        console.error('newVotes ids are not valid', newVote)
        return
    }

    const sessionVoteDb = db
        .collection('projects')
        .doc(newVote.projectId)
        .collection('sessionVotes')
        .doc(newVote.sessionId)

    return sessionVoteDb
        .get()
        .then(snapshot => {
            let aggregatedValue
            const session = snapshot.data()
            if (newVote.text) {
                const voteText = {
                    text: newVote.text,
                    createdAt: newVote.createdAt,
                    userId: userId
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
                    console.log('Adding ', aggregatedValue[newVoteId])
                } else {
                    if (!snapshot.exists || !session[newVote.voteItemId]) {
                        aggregatedValue = {}
                    } else {
                        aggregatedValue = session[newVote.voteItemId]
                        delete aggregatedValue[newVoteId]
                    }
                    console.log('deleteing ', aggregatedValue[newVoteId])
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

function isIdValid(id) {
    return id && id.length > 0
}

module.exports = {
    aggregateVotesCreate,
    aggregateVotesDelete
}
