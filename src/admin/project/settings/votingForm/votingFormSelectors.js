import { getAdminStateSelector } from '../../../adminSelector'
import { createSelector } from 'reselect'

const getVotingForm = state => getAdminStateSelector(state).adminVotingForm

export const getVoteItemsSelector = state => getVotingForm(state).voteItems
export const isSavingSelector = state => getVotingForm(state).ongoingSave

// MEMOIZED

export const getBooleanVoteItemsSelector = createSelector(
    getVoteItemsSelector,
    voteItems => {
        return voteItems
            .filter(item => item.type === 'boolean')
            .sort((a, b) => a.position - b.position)
    }
)

export const getCommentVoteItemSelector = createSelector(
    getVoteItemsSelector,
    voteItems => {
        return voteItems.filter(item => item.type === 'text')[0]
    }
)

export const isCommentEnableSelector = createSelector(
    getCommentVoteItemSelector,
    item => {
        return !!item
    }
)
