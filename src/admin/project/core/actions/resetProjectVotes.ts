import type { TFunction } from 'i18next'
import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'

export type ResetVotesProgressUpdate = (
    totalDocs: number,
    deletingDocsCount?: number
) => void

export const resetProjectVotes =
    (
        projectId: string,
        // Unused, kept for the callers' signature.
        _t: TFunction,
        progressUpdates: ResetVotesProgressUpdate = () => {}
    ): AppThunk<Promise<boolean>> =>
    async () => {
        const userVotes = await getDocs(
            collection(fireStoreMainInstance, `projects/${projectId}/userVotes`)
        ).then(async (snapshot) => {
            const userVotesIds: string[] = []
            snapshot.forEach((doc) => userVotesIds.push(doc.id))
            return userVotesIds
        })
        progressUpdates(userVotes.length)

        const sessionVotes = await getDocs(
            collection(
                fireStoreMainInstance,
                `projects/${projectId}/sessionVotes`
            )
        ).then(async (snapshot) => {
            const ids: string[] = []
            snapshot.forEach((doc) => ids.push(doc.id))
            return ids
        })

        const totalCount = userVotes.length + sessionVotes.length
        progressUpdates(totalCount)

        let deleteCount = 0

        for (const id of userVotes) {
            await deleteDoc(
                doc(
                    fireStoreMainInstance,
                    `projects/${projectId}/userVotes`,
                    id
                )
            )
            deleteCount += 1
            progressUpdates(totalCount, deleteCount)
        }

        for (const id of sessionVotes) {
            await deleteDoc(
                doc(
                    fireStoreMainInstance,
                    `projects/${projectId}/sessionVotes`,
                    id
                )
            )
            deleteCount += 1
            progressUpdates(totalCount, deleteCount)
        }

        return true
    }
