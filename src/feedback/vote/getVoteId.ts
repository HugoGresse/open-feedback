import { getUserVotesByTalkAndVoteItemSelector } from './voteSelectors'
import { fireStoreMainInstance } from '../../firebase.ts'
import { findReusableVote } from './findReusableVote'
import type { Vote, VoteItem } from '../../core/models'
import type { RootState } from '../../store'

/**
 * Get a new vote id or the existing one if only need update
 * @param voteItem
 * @param projectId
 * @param getState
 * @param data the user text vote value if updating
 * @param upVotedVoteId the text vote id when up-voting another text vote
 * @returns the vote id, and the existing vote when updating it
 */
export const getVoteId = (
    voteItem: VoteItem,
    projectId: string,
    getState: () => RootState,
    data: string | null = null,
    upVotedVoteId?: string
): [id: string, existingVote?: Vote] => {
    const existingVote = findReusableVote(
        getUserVotesByTalkAndVoteItemSelector(getState())[voteItem.id],
        data,
        upVotedVoteId
    )
    if (existingVote) {
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
