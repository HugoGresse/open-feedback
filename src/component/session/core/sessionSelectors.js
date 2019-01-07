import { createSelector } from 'reselect'
import groupBy from 'lodash/groupBy'
import moment from 'moment'
import { getSpeakersList } from '../../speaker/core'

export const getSessions = state => state.sessions

export const getSessionsList = state => getSessions(state).list

export const getSessionsFilter = state => getSessions(state).filter || ''

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

export const getSessionsGroupByDateAndTrack = createSelector(
    getSessionsAsArray,
    getSessionsFilter,
    (sessions, filter) => {
        // Group Session by day
        const sessionsGroupByDate = groupBy(sessions, session =>
            moment(session.startTime).format('YYYY-MM-DD')
        )

        // Group session by day > track
        const sessionsByDateAndTrack = {}
        Object.keys(sessionsGroupByDate).forEach(sessionsDayId => {
            sessionsByDateAndTrack[sessionsDayId] = groupBy(
                sessionsGroupByDate[sessionsDayId],
                session => session.trackTitle
            )
        })

        // Convert Day & Track object to array
        // Filter the session title
        return Object.keys(sessionsByDateAndTrack).reduce((acc, date) => {
            acc.push({
                date: date,
                tracks: Object.keys(sessionsByDateAndTrack[date]).reduce(
                    (acc, track) => {
                        acc.push({
                            track: track,
                            sessions: sessionsByDateAndTrack[date][
                                track
                            ].filter(session =>
                                session.title
                                    .toLowerCase()
                                    .includes(filter.toLowerCase())
                            )
                        })
                        return acc
                    },
                    []
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

export const getSpeakersForSelectedSession = createSelector(
    getSelectedSession,
    getSpeakersList,
    (session, speakers) => {
        if (!session) return []
        return Object.values(speakers).filter(speaker => {
            return session.speakers.includes(speaker.id)
        })
    }
)
