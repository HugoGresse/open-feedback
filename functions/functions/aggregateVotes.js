const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()

const aggregateVotesCreate = functions.firestore
    .document('/users/{userId}/votes/{voteId}')
    .onCreate((snapshot, context) => {
        return incrementVoteAggregate(snapshot.data(), +1)
    })

const aggregateVotesDelete = functions.firestore
    .document('/users/{userId}/votes/{voteId}')
    .onDelete((snapshot, context) => {
        return incrementVoteAggregate(snapshot.data(), -1)
    })

function incrementVoteAggregate(newVote, increment) {
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
            const session = snapshot.data()

            // If session has not been created yet OR the voteItem has noot been created, set the first int
            if (!snapshot.exists || !session[newVote.voteItemId]) {
                return sessionVoteDb.set(
                    {
                        [newVote.voteItemId]: increment
                    },
                    { merge: true }
                )
            }

            // Else, increment it
            const newValue = session[newVote.voteItemId] + increment
            return sessionVoteDb.set(
                {
                    [newVote.voteItemId]: newValue
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
