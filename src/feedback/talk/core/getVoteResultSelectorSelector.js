import { createSelector } from 'reselect'
import {
    getProjectVoteResultsSelector,
    hideVotesUntilUserVoteSelector,
} from '../../project/projectSelectors'
import { getUserVotesByTalkAndVoteItemSelector } from '../../vote/voteSelectors'
import { getSelectedTalkIdSelector } from './talkSelectors'

export const getVoteResultSelectorSelector = createSelector(
    getSelectedTalkIdSelector,
    getProjectVoteResultsSelector,
    hideVotesUntilUserVoteSelector,
    getUserVotesByTalkAndVoteItemSelector,
    (selectedTalkId, voteResults, hideVotesUntilUserVote, currentUserVotes) => {
        if (
            hideVotesUntilUserVote &&
            (!currentUserVotes || Object.keys(currentUserVotes).length === 0)
        ) {
            // Hide other users votes until the user vote
            return []
        }
        if (!voteResults || !voteResults[selectedTalkId]) {
            return []
        }
        let results = voteResults[selectedTalkId]

        // Transform results.id.{ id: voteText1, id: voteText2, id: voteText3} into an array
        let transformResult = {}
        Object.entries(results).forEach(([key, value]) => {
            if (typeof value === 'object') {
                transformResult[key] = []
                Object.entries(value).forEach(([, value2]) => {
                    const keys = Object.keys(value2)
                    if (
                        !value2 ||
                        keys.length === 0 ||
                        (keys.length === 1 && keys[0] === 'id')
                    ) {
                        // Empty object due to deletion
                        return
                    }
                    transformResult[key].push({
                        ...value2,
                        updatedAt: value2.updatedAt.toDate(),
                        createdAt: value2.createdAt.toDate(),
                    })
                })
                transformResult[key] = transformResult[key].sort(
                    (a, b) => b.updatedAt - a.updatedAt
                )
            } else {
                transformResult[key] = value
            }
        })

        return transformResult
    }
)
