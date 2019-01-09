const functions = require('firebase-functions')
const admin = require('firebase-admin')

const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://open-feedback-42.firebaseio.com'
})

const db = admin.firestore()
settings = { timestampsInSnapshots: true }
db.settings(settings)

const aggregateVotes = require('./functions/aggregateVotes')

exports.aggregateVotesCreate = aggregateVotes.aggregateVotesCreate
exports.aggregateVotesDelete = aggregateVotes.aggregateVotesDelete
