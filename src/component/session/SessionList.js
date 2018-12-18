import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFilteredSessions, sessionActions } from "./core"
import { createSelector } from "reselect"
import SessionItem from "./SessionItem"
import Grid from "@material-ui/core/Grid"
import { getFilteredSchedules, scheduleActions } from "../schedule/core"
import { withStyles } from "@material-ui/core"

const styles = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
});


class SessionList extends Component {

    componentDidMount() {
        this.props.getSessions()
        this.props.getSchedules()
    }

    render() {
        const {sessions, schedule, classes} = this.props;

        if(!sessions || !schedule) return "Data loading"

        console.log(schedule)

        return schedule.map(scheduleItem =>
            <Grid container spacing={24} className={classes.layout} key={scheduleItem.date}>
                <Grid item xs >
                    { scheduleItem.date }
                </Grid>

                {
                    scheduleItem.timeslots.map(timeslot =>
                        timeslot.sessions.map(timeslotSessions =>
                            timeslotSessions.items.map(sessionId =>
                                <SessionItem
                                    key={sessionId}
                                    session={sessions[sessionId]}/>
                            )
                        )
                    )
                }

        </Grid>)
    }
}

const mapStateToProps = createSelector(
    getFilteredSessions,
    getFilteredSchedules,
    (sessions, schedule) => ({
        sessions,
        schedule
    })
)

const mapDispatchToProps = Object.assign({}, sessionActions, scheduleActions)

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SessionList))