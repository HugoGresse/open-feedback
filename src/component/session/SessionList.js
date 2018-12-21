import React, { Component } from "react"
import { connect } from "react-redux"
import { getSessionsGroupByDate, sessionActions } from "./core"
import SessionItem from "./SessionItem"
import Grid from "@material-ui/core/Grid"
import { withStyles } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { Route } from "react-router-dom"
import SessionVote from "./SessionVote"

const styles = theme => ({
    layout: {
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
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

    onSessionClicked = (session) => {
        this.props.setSelectedSession(session.id)
    }

    render() {
        const {sessionsByDate, classes, match} = this.props
        if (!sessionsByDate) return "Data loading"

        return sessionsByDate.map((current, key) => (
            <div key={key}>
                <Grid item xs>
                    <Typography variant="h5">{current.date}</Typography>
                </Grid>

                <Grid container className={classes.layout}>
                    {current.sessions.map((session, key) => (
                        <SessionItem
                            key={key}
                            session={session}
                            onClick={this.onSessionClicked}
                        />
                    ))}
                </Grid>


                <Route path={`${match.path}/:id`} component={SessionVote}/>
            </div>
        ))
    }


// <Grid container className={classes.layout}>
// {current.sessions.map((session, key) => (
//     <Link
//         key={key}
//         to={`${match.url}/${session.id}`}>
//         <SessionItem
//             session={session}
//             onClick={this.onSessionClicked}
//         />
//     </Link>
//
// ))}
// </Grid>
}

const mapStateToProps = state => ({
    sessionsByDate: getSessionsGroupByDate(state)
})

const mapDispatchToProps = Object.assign({}, sessionActions)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SessionList))
