import { getDateFromStartTime } from './talksUtils'
import { getProjectSelectedDateSelector } from '../../feedback/project/projectSelectors'
import { getSpeakersListSelector } from '../speakers/speakerSelectors'
import { DateTime } from 'luxon'
import { createAppSelector, type RootState } from '../../store'
import type { Talk, TalksMap } from '../models'

/** A talk with its start/end times parsed (null when missing). */
export interface TalkWithLuxonTimes extends Talk {
    startTimeLuxon: DateTime | null
    endTimeLuxon: DateTime | null
}

export interface TalksByTrack {
    track: string
    talks: TalkWithLuxonTimes[]
}

export const getTalksSelector = (state: RootState) => state.talks

export const getTalksListSelector = (state: RootState): TalksMap =>
    getTalksSelector(state).list || {}

export const getTalksFilterSelector = (state: RootState) =>
    getTalksSelector(state).filter || ''

export const getTalksLoadError = (state: RootState) =>
    getTalksSelector(state).errorTalksLoad

export const isTalksLoadingSelector = (state: RootState) =>
    getTalksSelector(state).loading

export const isTalkLoadedSelector = (state: RootState) =>
    getTalksSelector(state).loaded

//  MEMOIZED SELECTORS HERE

export const getTalksAsArraySelector = createAppSelector(
    getTalksListSelector,
    (talks) => {
        return Object.keys(talks).reduce<Talk[]>((acc, id) => {
            if (talks[id].hideInFeedback) {
                // Some talks are not displayed (break time, etc)
                return acc
            }
            acc.push(talks[id])
            return acc
        }, [])
    }
)

export const getTalksDatesSelector = createAppSelector(
    getTalksAsArraySelector,
    (talks) => {
        return talks
            .reduce<string[]>((acc, talk) => {
                const date = getDateFromStartTime(talk.startTime)
                if (!acc.includes(date)) {
                    acc.push(date)
                }
                return acc
            }, [])
            .sort()
    }
)

export const getFilteredTalksSelector = createAppSelector(
    getTalksAsArraySelector,
    getTalksFilterSelector,
    getSpeakersListSelector,
    (talks, filter, speakers) => {
        const cleanedFilterInput = filter.toLowerCase().trim()

        return talks.filter((talk) => {
            const titleMatch = talk.title
                .toLowerCase()
                .includes(cleanedFilterInput)

            let speakerMatch = 0
            if (!talk.speakers) {
                speakerMatch = -1
            } else if (
                talk.speakers
                    .filter((speakerId) => speakerId.length > 0)
                    .map((speakerId) => speakers[speakerId])
                    .filter((speaker) => speaker && speaker.name)
                    .map((speaker) => speaker.name)
                    .filter((speakerName) => {
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
                talk.tags.filter((tag) =>
                    tag.toLowerCase().includes(cleanedFilterInput)
                ).length > 0

            return titleMatch || speakerMatch > 0 || tagMatch
        })
    }
)

export const getFilteredTalksAsMapSelector = createAppSelector(
    getFilteredTalksSelector,
    (talks) => {
        const data: TalksMap = {}

        talks.forEach((talk) => {
            data[talk.id] = talk
        })

        return data
    }
)

export const getCurrentTalksGroupByTrackSelector = createAppSelector(
    getFilteredTalksSelector,
    getProjectSelectedDateSelector,
    (talks, date) => {
        const filteredTalks = talks.filter((talk) => {
            return date === getDateFromStartTime(talk.startTime)
        })

        if (filteredTalks.length === 0) {
            return []
        }
        const talksGroupByTrack = filteredTalks.reduce<
            Record<string, TalkWithLuxonTimes[]>
        >((acc, talk) => {
            // A talk without track is grouped under "undefined".
            const trackTitle = String(talk.trackTitle)
            if (!acc[trackTitle]) {
                acc[trackTitle] = []
            }
            acc[trackTitle].push({
                ...talk,
                startTimeLuxon: talk.startTime
                    ? DateTime.fromISO(talk.startTime, {
                          setZone: true,
                      })
                    : null,
                endTimeLuxon: talk.endTime
                    ? DateTime.fromISO(talk.endTime, {
                          setZone: true,
                      })
                    : null,
            })

            return acc
        }, {})

        return Object.keys(talksGroupByTrack)
            .sort()
            .reduce<TalksByTrack[]>((acc, track) => {
                acc.push({
                    track: track,
                    talks: talksGroupByTrack[track].sort((a, b) => {
                        if (!a.startTimeLuxon || !b.startTimeLuxon) {
                            return 0
                        }
                        return (
                            a.startTimeLuxon.toMillis() -
                            b.startTimeLuxon.toMillis()
                        )
                    }),
                })
                return acc
            }, [])
    }
)

export const getExtendedSearchTalksSelector = createAppSelector(
    getFilteredTalksSelector,
    getProjectSelectedDateSelector,
    (talks, selectedDate) => {
        return talks.filter(
            (talk) => selectedDate !== getDateFromStartTime(talk.startTime)
        )
    }
)

export const getTracksSelector = createAppSelector(
    getTalksAsArraySelector,
    (talks) => {
        return [
            ...new Set(
                talks
                    .map((talk) => talk.trackTitle)
                    .filter((track): track is string => !!track)
            ),
        ].sort()
    }
)

export const getTagsSelector = createAppSelector(
    getTalksAsArraySelector,
    (talks) => {
        return [
            ...new Set(
                talks.reduce<string[]>((acc, talk) => {
                    if (!talk.tags) {
                        return acc
                    }
                    talk.tags.forEach((tag) => {
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
