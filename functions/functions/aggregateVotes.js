const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()

const aggregateVotesCreate = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onCreate((snapshot, context) => {
        return incrementVoteAggregate(snapshot.id, snapshot.data(), +1)
    })

const aggregateVotesDelete = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onDelete((snapshot, context) => {
        return incrementVoteAggregate(snapshot.id, snapshot.data(), -1)
    })

const aggregateVotesUpdate = functions.firestore
    .document('/projects/{projectId}/userVotes/{voteId}')
    .onUpdate((change, context) => {
        return incrementVoteAggregate(change.after.id, change.after.data(), 1)
    })

function incrementVoteAggregate(newVoteId, newVote, increment) {
    newVote.sessionId = "" + newVote.sessionId
    if (
        !isIdValid(newVote.projectId) ||
        !isIdValid(newVote.sessionId) ||
        !isIdValid(newVote.voteItemId) ||
        !isIdValid(newVote.userId) ||
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

function isIdValid(id) {
    return id && id.length > 0
}

module.exports = {
    aggregateVotesCreate,
    aggregateVotesDelete,
    aggregateVotesUpdate
}
