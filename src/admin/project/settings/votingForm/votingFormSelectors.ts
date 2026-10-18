import { getAdminStateSelector } from '../../../adminSelector'
import { createAppSelector, type RootState } from '../../../../store'
import type { VoteItem } from '../../../../core/models'
import type { VotingFormState } from './votingFormReducer'

const getVotingForm = (state: RootState): VotingFormState =>
    getAdminStateSelector(state).adminVotingForm

export const getVoteItemsSelector = (state: RootState): VoteItem[] =>
    getVotingForm(state).voteItems
export const isSavingVotingFormSelector = (state: RootState): boolean =>
    getVotingForm(state).ongoingSave
export const shouldConfirmSaveSelector = (state: RootState): boolean =>
    getVotingForm(state).shouldConfirmSave

// A missing position compares like `undefined` did in the untyped code: every
// comparison is false and every subtraction NaN.
const positionOf = (item: VoteItem): number => item.position ?? NaN

// MEMOIZED

export const getSortedVoteItemsSelector = createAppSelector(
    [getVoteItemsSelector],
    (voteItems) =>
        voteItems.sort((a, b) => {
            return positionOf(a) > positionOf(b) ? 1 : -1
        })
)

export const getBooleanVoteItemsSelector = createAppSelector(
    [getSortedVoteItemsSelector],
    (voteItems) => {
        return voteItems
            .filter((item) => item.type === 'boolean')
            .sort((a, b) => positionOf(a) - positionOf(b))
    }
)

export const getCommentVoteItemSelector = createAppSelector(
    [getSortedVoteItemsSelector],
    (voteItems) => {
        return voteItems.filter((item) => item.type === 'text')
    }
)
