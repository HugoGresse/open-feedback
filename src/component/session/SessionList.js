import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFilteredSessions, sessionActions } from "./core"
import { createSelector } from "reselect"
import SessionItem from "./SessionItem"
import Grid from "@material-ui/core/Grid"
import { getSchedulesList, scheduleActions } from "../schedule/core"
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
        const {sessions, classes} = this.props;

        if(!sessions){
            return "No Sessions loaded"
        }


        return (

            <Grid container spacing={24} className={classes.layout}>
                {
                    sessions.map( session =>
                        <SessionItem
                            session={session}/>
                    )
                }
            </Grid>
        )
    }
}

const mapStateToProps = createSelector(
    getFilteredSessions,
    getSchedulesList,
    (sessions, schedules) => ({
        sessions,
        schedules
    })
)

const mapDispatchToProps = Object.assign({}, sessionActions, scheduleActions)

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SessionList))