import React, { Component } from "react"
import { connect } from "react-redux"
import { getSessionsGroupByDate, sessionActions } from "./core"
import { speakerActions } from "./../speaker/core"
import SessionItem from "./SessionItem"
import Grid from "@material-ui/core/Grid"
import { withStyles } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import moment from "moment"

const styles = theme => ({
})

class SessionList extends Component {

    componentDidMount() {
        this.props.getSessions()
        this.props.getSpeakers()
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
                            <Typography variant="h5">{moment(current.date).format("dddd D")}</Typography>
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

const mapDispatchToProps = Object.assign({}, sessionActions, speakerActions)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SessionList))
