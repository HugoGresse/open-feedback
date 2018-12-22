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

        return <div>
            {
                sessionsByDate.map((current, key) => (<div key={key}>
                        <Grid item xs>
                            <Typography variant="h5">{current.date}</Typography>
                        </Grid>

                        <Grid container>
                            {current.sessions.map((session, key) => (
                                <SessionItem
                                    key={key}
                                    session={session}
                                    relativeUrl={match.path}
                                    onClick={this.onSessionClicked}
                                />
                            ))}
                        </Grid>

                    </div>
                ))
            }
        </div>
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
