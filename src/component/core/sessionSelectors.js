import { createSelector } from 'reselect'

export function getSessions(state) {
    return state.sessions
}

export function getSessionsList(state) {
    return getSessions(state).list
}

export function getSessionsFilter(state) {
    return getSessions(state).filter
}


//  MEMOIZED SELECTORS HERE

export const getFilteredSessions = createSelector(
    getSessionsList,
    getSessionsFilter,
    (list, filter) => {
        return list
    }
)