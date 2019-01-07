import moment from 'moment'

export const formatSessionsWithScheduled = (sessions, schedule) => {
    const formatedSessions = {}

    schedule.forEach(day => {
        const tracks = day.tracks

        day.timeslots.forEach(timeslot => {
            const startTime = moment(
                day.date + 'T' + timeslot.startTime
            ).format()
            const endTime = moment(day.date + 'T' + timeslot.endTime).format()
            timeslot.sessions.forEach((session, index) => {
                session.items.forEach(id => {
                    if (!sessions[id]) return
                    formatedSessions[id] = {
                        ...sessions[id],
                        startTime,
                        endTime,
                        ...{
                            trackTitle: tracks[index].title
                        }
                    }
                })
            })
        })
    })

    return formatedSessions
}
