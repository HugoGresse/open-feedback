import { DateTime } from 'luxon'

export const formatTalksWithScheduledForHoverboardv2 = (talks, schedule) => {
    const formatedTalks = {}

    schedule.forEach((day) => {
        const tracks = day.tracks

        day.timeslots.forEach((timeslot) => {
            const startTime = DateTime.fromISO(
                day.date + 'T' + timeslot.startTime
            ).toISO()
            const endTime = DateTime.fromISO(
                day.date + 'T' + timeslot.endTime
            ).toISO()
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

export const getDateFromStartTime = (startTime) => {
    const dateTime = DateTime.fromISO(startTime)
    if (dateTime.isValid) {
        return dateTime.toFormat('yyyy-MM-dd')
    }
    return TALK_NO_DATE
}

export const TALK_NO_DATE = '0-no-date'
