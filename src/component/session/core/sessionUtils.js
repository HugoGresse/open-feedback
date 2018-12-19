import moment from "moment";

export const formatSessionsWithScheduled = (sessions, schedule) => {
  const formatedSessions = {};

  schedule.map(day => {
    day.timeslots.map(timeslot => {
      const startTime = moment(day.date + "T" + timeslot.startTime).format();
      const endTime = moment(day.date + "T" + timeslot.endTime).format();
      timeslot.sessions.map(session => {
        session.items.map(id => {
          formatedSessions[id] = {
            ...sessions[id],
            startTime,
            endTime
          };
        });
      });
    });
  });

  return formatedSessions;
};
