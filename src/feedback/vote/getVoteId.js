import { getUserVotesByTalkAndVoteItemSelector } from './voteSelectors'
import { fireStoreMainInstance } from '../../firebase'

export const getVoteId = (voteItem, projectId, getState) => {
    const existingVote = getUserVotesByTalkAndVoteItemSelector(getState())[
        voteItem.id
    ]

    if (existingVote) {
        if (existingVote.pending) {
            // eslint-disable-next-line no-console
            console.info(
                'Unable to modify a vote that has not been written on the database'
            )
            return
        }

        return [existingVote.id, existingVote]
    }

    return [
        fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .collection('userVotes')
            .doc().id,
    ]
}
