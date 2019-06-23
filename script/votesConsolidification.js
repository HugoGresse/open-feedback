import admin from 'firebase-admin'
import serviceAccount from '../serviceAccountKey'

let firestore = null
const initializeFirebase = () => {
    return new Promise(resolve => {
        const firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })
        firestore = admin.firestore()
        resolve(firebaseApp)
    })
}

const consolidateVoteForSession = projectId => {
    const sessionId = '2' // to delete

    const result = []

    return firestore
        .collection('users')
        .get()
        .then(snapshot => {
            const docIds = []
            snapshot.forEach(doc => {
                docIds.push(doc.id)
            })
            return docIds
        })
        .then(docIds => {
            const promises = []

            docIds.forEach(id => {
                promises.push(
                    firestore
                        .collection('users')
                        .doc(id)
                        .collection('votes')
                        .where('projectId', '==', projectId)
                        .where('sessionId', '==', sessionId)
                        .where('voteItemId', '==', 'u1qPfvDb9XTddQziJvud')
                        .get()
                )
            })

            return Promise.all(promises)
        })
        .then(querySnapshots => {
            querySnapshots.forEach(querySnapshot => {
                console.log('size: ' + querySnapshot.size)
            })
            return querySnapshots
                .map(qs => qs.docs)
                .reduce((acc, docs) => [...acc, ...docs])
        })
        .then(docRefs => {
            console.log('docrefs', docRefs.length)
            docRefs.forEach(doc => {
                result.push(doc.data())
            })
            console.log(result)
            console.log('number of items: ', docRefs.length)
        })
        .catch(error => {
            console.error(error)
        })
}

initializeFirebase()
    .then(() => consolidateVoteForSession('eaJnyMXD3oNfhrrnBYDT'))
    .catch(error => {
        console.error(error)
        process.exit()
    })
