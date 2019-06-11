import { createSelector } from 'reselect'
import groupBy from 'lodash/groupBy'
import { getDateFromStartTime } from './sessionsUtils'
import { getProjectSelectedDate } from '../../project/projectSelectors'
import { getSpeakersList } from '../../speaker/core'

export const getSessions = state => state.sessions

export const getSessionsList = state => getSessions(state).list

export const getSessionsFilter = state => getSessions(state).filter || ''

export const getSessionsLoadError = state =>
    getSessions(state).errorSessionsLoad

export const getSessionsLoading = state => getSessions(state).loading

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
        return sessions
            .reduce((acc, session) => {
                const date = getDateFromStartTime(session.startTime)
                if (!acc.includes(date)) {
                    acc.push(date)
                }
                return acc
            }, [])
            .sort()
    }
)

export const getCurrentSessionsGroupByTrack = createSelector(
    getSessionsAsArray,
    getSessionsFilter,
    getProjectSelectedDate,
    getSpeakersList,
    (sessions, filter, date, speakers) => {
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
                    .filter(speakerId => speakerId.length > 0)
                    .map(speakerId => speakers[speakerId])
                    .filter(speaker => speaker && speaker.name)
                    .map(speaker => speaker.name)
                    .filter(speakerName => {
                        return speakerName
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

        return Object.keys(sessionsGroupByTrack)
            .sort()
            .reduce((acc, track) => {
                acc.push({
                    track: track,
                    sessions: sessionsGroupByTrack[track]
                })
                return acc
            }, [])
    }
)
