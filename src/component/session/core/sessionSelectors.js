import { createSelector } from 'reselect'
import groupBy from 'lodash/groupBy'
import { getSpeakersList } from '../../speaker/core'
import { getDateFromStartTime } from './sessionUtils'
import {
    getProjectVoteResults,
    getProjectSelectedDate
} from '../../project/projectSelectors'

export const getSessions = state => state.sessions

export const getSessionsList = state => getSessions(state).list

export const getSessionsFilter = state => getSessions(state).filter || ''

export const getSelectedSessionId = state => getSessions(state).selected

export const getSessionsLoadError = state =>
    getSessions(state).errorSessionsLoad

export const getSessionLoadError = state => getSessions(state).errorSessionLoad

//  MEMOIZED SELECTORS HERE

export const getSessionsAsArray = createSelector(
    getSessionsList,
    sessions => {
        return Object.keys(sessions).reduce((acc, id) => {
            acc.push(sessions[id])
            return acc
        }, [])
    }
)

export const getFilteredSessions = createSelector(
    getSessionsList,
    list => {
        return list
    }
)

export const getSessionsDates = createSelector(
    getSessionsAsArray,
    sessions => {
        return sessions.reduce((acc, session) => {
            const date = getDateFromStartTime(session.startTime)
            if (!acc.includes(date)) {
                acc.push(date)
            }
            return acc
        }, [])
    }
)

export const getCurrentSessionsGroupByTrack = createSelector(
    getSessionsAsArray,
    getSessionsFilter,
    getProjectSelectedDate,
    (sessions, filter, date) => {
        const cleanedFilterInput = filter.toLowerCase().trim()

        const filteredSessions = sessions.filter(session => {
            const titleMatch = session.title
                .toLowerCase()
                .includes(cleanedFilterInput)

            let speakerMatch = 0
            if (!session.speakers) {
                speakerMatch = -1
            } else if (
                session.speakers
                    .filter(speaker => speaker.length > 0)
                    .filter(speaker => {
                        return speaker
                            .toLowerCase()
                            .replace('_', ' ')
                            .includes(cleanedFilterInput)
                    }).length > 0
            ) {
                speakerMatch = 1
            }

            const tagMatch =
                session.tags &&
                session.tags.filter(tag => {
                    return tag.toLowerCase().includes(filter)
                }).length > 0

            return (
                (titleMatch || speakerMatch > 0 || tagMatch) &&
                date === getDateFromStartTime(session.startTime)
            )
        })

        const sessionsGroupByTrack = groupBy(
            filteredSessions,
            session => session.trackTitle
        )

        return Object.keys(sessionsGroupByTrack).reduce((acc, track) => {
            acc.push({
                track: track,
                sessions: sessionsGroupByTrack[track]
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
        if (!session || !session.speakers) return []
        return Object.values(speakers).filter(speaker => {
            return session.speakers.includes(speaker.id)
        })
    }
)

export const getVoteResultSelector = createSelector(
    getSelectedSessionId,
    getProjectVoteResults,
    (selectedSessionId, voteResults) => {
        if (!voteResults || !voteResults[selectedSessionId]) {
            return []
        }
        return voteResults[selectedSessionId]
    }
)
