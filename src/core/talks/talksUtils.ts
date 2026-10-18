import { DateTime } from 'luxon'
import type { TalksMap } from '../models'

/** A `schedule/{day}` document of a Hoverboard v2 project. */
export interface HoverboardScheduleDay {
    /** yyyy-MM-dd */
    date: string
    tracks: { title: string }[]
    timeslots: {
        startTime: string
        endTime: string
        /** One entry per track, `items` holds the session ids. */
        sessions: { items: string[] }[]
    }[]
}

export const formatTalksWithScheduledForHoverboardv2 = (
    talks: TalksMap,
    schedule: HoverboardScheduleDay[]
): TalksMap => {
    const formatedTalks: TalksMap = {}

    schedule.forEach((day) => {
        const tracks = day.tracks

        day.timeslots.forEach((timeslot) => {
            // toISO() is null for an invalid date: stored as undefined.
            const startTime =
                DateTime.fromISO(day.date + 'T' + timeslot.startTime).toISO() ??
                undefined
            const endTime =
                DateTime.fromISO(day.date + 'T' + timeslot.endTime).toISO() ??
                undefined
            timeslot.sessions.forEach((talk, index) => {
                talk.items.forEach((id) => {
                    if (!talks[id]) return
                    formatedTalks[id] = {
                        ...talks[id],
                        startTime,
                        endTime,
                        trackTitle: tracks[index].title,
                    }
                })
            })
        })
    })

    return formatedTalks
}

export const getDateFromStartTime = (startTime: string | null | undefined) => {
    if (!startTime) {
        return TALK_NO_DATE
    }
    const dateTime = DateTime.fromISO(startTime)
    if (dateTime.isValid) {
        return dateTime.toFormat('yyyy-MM-dd')
    }
    return TALK_NO_DATE
}

export const TALK_NO_DATE = '0'
