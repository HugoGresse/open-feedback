import moment from 'moment'

export const formatTalksWithScheduledForHoverboardv2 = (talks, schedule) => {
    const formatedTalks = {}

    schedule.forEach(day => {
        const tracks = day.tracks

        day.timeslots.forEach(timeslot => {
            const startTime = moment(
                day.date + 'T' + timeslot.startTime
            ).format()
            const endTime = moment(day.date + 'T' + timeslot.endTime).format()
            timeslot.sessions.forEach((talk, index) => {
                talk.items.forEach(id => {
                    if (!talks[id]) return
                    formatedTalks[id] = {
                        ...talks[id],
                        startTime,
                        endTime,
                        ...{
                            trackTitle: tracks[index].title,
                        },
                    }
                })
            })
        })
    })

    return formatedTalks
}

export const getDateFromStartTime = startTime => {
    return moment(startTime).format('YYYY-MM-DD')
}
