import React, { Component } from "react"
import { connect } from "react-redux"
import { getSessionsGroupByDate, sessionActions } from "./core"
import SessionItem from "./SessionItem"
import Grid from "@material-ui/core/Grid"
import { withStyles } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"

const styles = theme => ({
    layout: {
        marginLeft: 0,
        marginRight: 0,
        width:'100%',
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
            width: 900,
            marginLeft: "auto",
            marginRight: "auto"
        }
    }
})

class SessionList extends Component {
    componentDidMount() {
        this.props.getSessions()
    }

    render() {
        const {sessionsByDate, classes} = this.props
        if (!sessionsByDate) return "Data loading"

        return sessionsByDate.map((current, key) => (
            <div>
                <Grid item xs>
                    <Typography variant="h5">{current.date}</Typography>
                </Grid>

                <Grid container className={classes.layout} key={key}>

                    {current.sessions.map((session, key) => (
                        <SessionItem key={key} session={session}/>
                    ))}
                </Grid>
            </div>
        ))
    }
}

const mapStateToProps = state => ({
    sessionsByDate: getSessionsGroupByDate(state)
})

const mapDispatchToProps = Object.assign({}, sessionActions)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SessionList))
