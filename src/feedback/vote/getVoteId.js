import { getUserVotesByTalkAndVoteItemSelector } from './voteSelectors'
import { fireStoreMainInstance } from '../../firebase.ts'
import { VOTE_TYPE_TEXT_PLUS } from '../../core/contants'

/**
 * Get a new vote id or the existing one if only need update
 * @param voteItem
 * @param projectId
 * @param getState
 * @param data the user text vote value if updating
 * @returns {[string]|[undefined,*]}
 */
export const getVoteId = (voteItem, projectId, getState, data = null) => {
    const existingVotes =
        getUserVotesByTalkAndVoteItemSelector(getState())[voteItem.id]

    const isPendingVote = (vote) => {
        if (vote.pending) {
            // eslint-disable-next-line no-console
            console.info(
                'Unable to modify a vote that has not been written on the database'
            )
            return true
        }
        return false
    }

    if (existingVotes && existingVotes.length > 0) {
        if (data) {
            // The user is adding a text vote
            const existingVote = existingVotes.find(
                (vote) => vote.text && vote.voteType !== VOTE_TYPE_TEXT_PLUS
            )
            if (existingVote && !isPendingVote(existingVote)) {
                // The user is updating an existing text vote
                return [existingVote.id, existingVote]
            }
        } else {
            // The user is adding a boolean vote on another text or a boolean vote
            const existingVote = existingVotes.find((vote) => !vote.text)
            if (existingVote && !isPendingVote(existingVote)) {
                // The user is updating an existing boolean vote
                return [existingVote.id, existingVote]
            }
        }
    }

    return [
        fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .collection('userVotes')
            .doc().id,
    ]
}
