import moment from "moment"

export const formatSessionsWithScheduled = (sessions, schedule) => {
    const formatedSessions = {}

    schedule.forEach(day => {
        day.timeslots.forEach(timeslot => {
            const startTime = moment(day.date + "T" + timeslot.startTime).format()
            const endTime = moment(day.date + "T" + timeslot.endTime).format()
            timeslot.sessions.forEach(session => {
                session.items.forEach(id => {
                    formatedSessions[id] = {
                        ...sessions[id],
                        startTime,
                        endTime
                    }
                })
            })
        })
    })

    return formatedSessions
}
