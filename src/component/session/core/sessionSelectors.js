import { createSelector } from "reselect"
import groupBy from "lodash/groupBy"
import moment from "moment"

export const getSessions = state => state.sessions

export const getSessionsList = state => getSessions(state).list

export const getSessionsFilter = state => getSessions(state).filter || ""

export const getSelectedSessionId = state => getSessions(state).selected

export const getSessionsAsArray = createSelector(
    getSessionsList,
    sessions => {
        return Object.keys(sessions).reduce((acc, id) => {
            acc.push(sessions[id])
            return acc
        }, [])
    }
)

//  MEMOIZED SELECTORS HERE

export const getFilteredSessions = createSelector(
    getSessionsList,
    list => {
        return list
    }
)

export const getSessionsGroupByDate = createSelector(
    getSessionsAsArray,
    getSessionsFilter,
    (sessions, filter) => {
        const sessionsGroupByDate = groupBy(sessions, session =>
            moment(session.startTime).format("YYYY-MM-DD")
        )

        return Object.keys(sessionsGroupByDate).reduce((acc, date) => {
            acc.push({
                date: date,
                sessions: sessionsGroupByDate[date].filter(session =>
                    session.title.toLowerCase().includes(filter.toLowerCase())
                )
            })
            return acc
        }, [])
    }
)

export const getSelectedSession = createSelector(
    getSessionsList,
    getSelectedSessionId,
    (sessions, selectedSessionId) => {

        return sessions[selectedSessionId]
    }

)
