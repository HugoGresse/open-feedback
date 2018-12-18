import { createSelector } from 'reselect'

export const getSessions = state => state.sessions

export const getSessionsList = state => getSessions(state).list

export const getSessionsFilter = state => getSessions(state).filter


//  MEMOIZED SELECTORS HERE

export const getFilteredSessions = createSelector(
    getSessionsList,
    getSessionsFilter,
    (list, filter) => {
        if (filter) {
            return list.filter((session) => {
                if (session.title.toLowerCase().includes(filter.toLowerCase())) {
                    return true
                }
                // TODO : filter by speakers
                return false
            })
        }
        return list
    }
)