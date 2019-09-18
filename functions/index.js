const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const db = admin.firestore()
settings = { timestampsInSnapshots: true }
db.settings(settings)

const aggregateVotes = require('./functions/aggregateVotes')

exports.aggregateVotesCreate = aggregateVotes.aggregateVotesCreate
exports.aggregateVotesDelete = aggregateVotes.aggregateVotesDelete
exports.aggregateVotesUpdate = aggregateVotes.aggregateVotesUpdate
