import { createSelector } from 'reselect'
import groupBy from 'lodash/groupBy'
import { getDateFromStartTime } from './talksUtils'
import { getProjectSelectedDateSelector } from '../../feedback/project/projectSelectors'
import { getSpeakersListSelector } from '../speakers/speakerSelectors'

export const getTalksSelector = state => state.talks

export const getTalksListSelector = state => getTalksSelector(state).list

export const getTalksFilterSelector = state =>
    getTalksSelector(state).filter || ''

export const getTalksLoadError = state => getTalksSelector(state).errorTalksLoad

export const isTalksLoadingSelector = state => getTalksSelector(state).loading

export const isTalkLoadedSelector = state => getTalksSelector(state).loaded

//  MEMOIZED SELECTORS HERE

export const getTalksAsArraySelector = createSelector(
    getTalksListSelector,
    talks => {
        return Object.keys(talks).reduce((acc, id) => {
            if (talks[id].hideInFeedback) {
                // Some talks are not displayed (break time, etc)
                return acc
            }
            acc.push(talks[id])
            return acc
        }, [])
    }
)

export const getTalksDatesSelector = createSelector(
    getTalksAsArraySelector,
    talks => {
        return talks
            .reduce((acc, talk) => {
                const date = getDateFromStartTime(talk.startTime)
                if (!acc.includes(date)) {
                    acc.push(date)
                }
                return acc
            }, [])
            .sort()
    }
)

export const getFilteredTalksSelector = createSelector(
    getTalksAsArraySelector,
    getTalksFilterSelector,
    getSpeakersListSelector,
    (talks, filter, speakers) => {
        const cleanedFilterInput = filter.toLowerCase().trim()

        return talks.filter(talk => {
            const titleMatch = talk.title
                .toLowerCase()
                .includes(cleanedFilterInput)

            let speakerMatch = 0
            if (!talk.speakers) {
                speakerMatch = -1
            } else if (
                talk.speakers
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
                talk.tags &&
                talk.tags.filter(tag =>
                    tag.toLowerCase().includes(cleanedFilterInput)
                ).length > 0

            return titleMatch || speakerMatch > 0 || tagMatch
        })
    }
)

export const getFilteredTalksAsMapSelector = createSelector(
    getFilteredTalksSelector,
    talks => {
        const data = {}

        talks.forEach(talk => {
            data[talk.id] = talk
        })

        return data
    }
)

export const getCurrentTalksGroupByTrackSelector = createSelector(
    getFilteredTalksSelector,
    getProjectSelectedDateSelector,
    (talks, date) => {
        const filteredTalks = talks.filter(talk => {
            return date === getDateFromStartTime(talk.startTime)
        })

        const talksGroupByTrack = groupBy(
            filteredTalks,
            talk => talk.trackTitle
        )

        return Object.keys(talksGroupByTrack)
            .sort()
            .reduce((acc, track) => {
                acc.push({
                    track: track,
                    talks: talksGroupByTrack[track],
                })
                return acc
            }, [])
    }
)

export const getTracksSelector = createSelector(
    getTalksAsArraySelector,
    talks => {
        return [
            ...new Set(
                talks.map(talk => talk.trackTitle).filter(track => !!track)
            ),
        ].sort()
    }
)

export const getTagsSelector = createSelector(
    getTalksAsArraySelector,
    talks => {
        return [
            ...new Set(
                talks.reduce((acc, talk) => {
                    if (!talk.tags) {
                        return acc
                    }
                    talk.tags.forEach(tag => {
                        if (!acc.includes(tag)) {
                            acc.push(tag)
                        }
                    })
                    return acc
                }, [])
            ),
        ].sort()
    }
)
