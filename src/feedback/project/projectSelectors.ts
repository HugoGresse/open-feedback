import { createAppSelector, type RootState } from '../../store'
import type { Project } from '../../core/models'

// The selectors reading a project field (`getProjectSelector(state)!`) are
// only used once the project is loaded: AppLayout renders the app after.

const getProjectState = (state: RootState) => state.project

const getProject = (state: RootState) => getProjectState(state).project

export const getProjectSelector = (state: RootState): Project | null => {
    const project = getProject(state)
    return project.id ? project : null
}

export const getProjectIdSelector = (state: RootState) => getProject(state).id

export const getProjectVoteStartEndTimeSelector = (
    state: RootState
): [Project['voteStartTime'], Project['voteEndTime']] => [
    getProjectSelector(state)!.voteStartTime,
    getProjectSelector(state)!.voteEndTime,
]
export const getProjectVoteItemsSelector = (state: RootState) =>
    getProjectSelector(state)!.voteItems
export const getProjectVoteResultsSelector = (state: RootState) =>
    getProjectState(state).talkVotes
export const getProjectLoadErrorSelector = (state: RootState) =>
    getProjectState(state).projectLoadError
export const isProjectNotFoundSelector = (state: RootState) =>
    getProjectState(state).projectLoadNotFound
export const getProjectSelectedDateSelector = (state: RootState) =>
    getProjectState(state).selectedDate
export const getProjectVotesErrorSelector = (state: RootState) =>
    getProjectState(state).projectVotesError
export const getProjectChipColorsSelector = (state: RootState) =>
    getProjectSelector(state)!.chipColors
export const hideVotesUntilUserVoteSelector = (state: RootState) =>
    getProjectSelector(state)!.hideVotesUntilUserVote
export const isLiveUserVotesSelector = (state: RootState) =>
    getProjectSelector(state)!.liveUserVotes
export const isFullDatesDisplayedSelector = (state: RootState) =>
    getProjectSelector(state)!.displayFullDates

//  MEMOIZED SELECTORS HERE

export const getProjectVoteItemsOrderedSelector = createAppSelector(
    getProjectVoteItemsSelector,
    (voteItems) => {
        if (!voteItems) {
            return []
        }
        return voteItems.sort((a, b) => {
            // A missing position compares as false, as before typing
            return (a.position ?? NaN) > (b.position ?? NaN) ? 1 : -1
        })
    }
)
