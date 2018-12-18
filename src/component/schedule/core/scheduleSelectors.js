import { createSelector } from "reselect"
import { getSessionsFilter, getSessionsList } from "../../session/core/sessionSelectors"

export const getSchedules = state => state.schedule

export const getSchedulesList = state => getSchedules(state).list

export const getFilteredSchedules = createSelector(
    getSchedulesList,
    getSessionsList,
    getSessionsFilter,
    (schedule, session, sessionFilter) => {

        // if (sessionFilter) {
        //     return schedule.filter(scheduleItem =>
        //         scheduleItem.timeslots.filter(timeslot =>
        //             timeslot.sessions.filter(timeslotSessions =>
        //                 timeslotSessions.items.filter(sessionId =>
        //                     session[sessionId].title.toLowerCase().includes(sessionFilter.toLowerCase())
        //                 )
        //             )
        //         )
        //     )
        // }

        if (sessionFilter && sessionFilter.length > 0) {
            return schedule.map(scheduleItem => {
                    scheduleItem.timeslots.map(timeslot => {
                            timeslot.sessions.map(timeslotSessions => {
                                    timeslotSessions.items = timeslotSessions.items.filter(sessionId =>
                                        session[sessionId].title.toLowerCase().includes(sessionFilter.toLowerCase())
                                    )
                                    //console.log(timeslotSessions.items)
                                    return timeslotSessions
                                }
                            )
                            return timeslot
                        }
                    )
                    return scheduleItem
                }
            )
        }

        return schedule
    }
)