import { fireStoreMainInstance } from '../../../../firebase.ts'

export const resetProjectVotes =
    (projectId, t, progressUpdates = (totalDocs, deletingDocsCount) => {}) =>
    async () => {
        const userVotes = await fireStoreMainInstance
            .collection(`projects/${projectId}/userVotes`)
            .get()
            .then(async (snapshot) => {
                const userVotesIds = []
                snapshot.forEach((doc) => userVotesIds.push(doc.id))
                return userVotesIds
            })
        progressUpdates(userVotes.length)

        const sessionVotes = await fireStoreMainInstance
            .collection(`projects/${projectId}/sessionVotes`)
            .get()
            .then(async (snapshot) => {
                const ids = []
                snapshot.forEach((doc) => ids.push(doc.id))
                return ids
            })

        const totalCount = userVotes.length + sessionVotes.length
        progressUpdates(totalCount)

        let deleteCount = 0

        for (const id of userVotes) {
            await fireStoreMainInstance
                .collection(`projects/${projectId}/userVotes`)
                .doc(id)
                .delete()
            deleteCount += 1
            progressUpdates(totalCount, deleteCount)
        }

        for (const id of sessionVotes) {
            await fireStoreMainInstance
                .collection(`projects/${projectId}/sessionVotes`)
                .doc(id)
                .delete()
            deleteCount += 1
            progressUpdates(totalCount, deleteCount)
        }

        return true
    }
