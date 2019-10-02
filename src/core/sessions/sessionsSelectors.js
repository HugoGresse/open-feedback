import { createSelector } from 'reselect'
import groupBy from 'lodash/groupBy'
import { getDateFromStartTime } from './sessionsUtils'
import { getProjectSelectedDateSelector } from '../../feedback/project/projectSelectors'
import { getSpeakersListSelector } from '../speakers/speakerSelectors'

export const getSessionsSelector = state => state.sessions

export const getSessionsListSelector = state => getSessionsSelector(state).list

export const getSessionsFilterSelector = state =>
    getSessionsSelector(state).filter || ''

export const getSessionsLoadError = state =>
    getSessionsSelector(state).errorSessionsLoad

export const isSessionsLoadingSelector = state =>
    getSessionsSelector(state).loading

export const isSessionLoadedSelector = state =>
    getSessionsSelector(state).loaded

//  MEMOIZED SELECTORS HERE

export const getSessionsAsArraySelector = createSelector(
    getSessionsListSelector,
    sessions => {
        return Object.keys(sessions).reduce((acc, id) => {
            if (sessions[id].hideInFeedback) {
                // Some sessions are not displayed (break time, etc)
                return acc
            }
            acc.push(sessions[id])
            return acc
        }, [])
    }
)

export const getSessionsDatesSelector = createSelector(
    getSessionsAsArraySelector,
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

export const getFilteredSessionsSelector = createSelector(
    getSessionsAsArraySelector,
    getSessionsFilterSelector,
    getSpeakersListSelector,
    (sessions, filter, speakers) => {
        const cleanedFilterInput = filter.toLowerCase().trim()

        return sessions.filter(session => {
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
                session.tags.filter(tag => tag.toLowerCase().includes(cleanedFilterInput)).length > 0

            return titleMatch || speakerMatch > 0 || tagMatch
        })
    }
)

export const getCurrentSessionsGroupByTrackSelector = createSelector(
    getFilteredSessionsSelector,
    getProjectSelectedDateSelector,
    (sessions, date) => {
        const filteredSessions = sessions.filter(session => {
            return date === getDateFromStartTime(session.startTime)
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
