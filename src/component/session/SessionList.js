import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSessionsGroupByDateAndTrack, sessionActions } from './core'
import { speakerActions } from './../speaker/core'
import SessionItem from './SessionItem'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'

const styles = theme => ({})

class SessionList extends Component {
    componentWillMount() {
        this.props.getSessions()
        this.props.getSpeakers()
    }

    onSessionClicked = session => {
        this.props.setSelectedSession(session.id)
    }

    render() {
        const { sessionsByDateAndTrack, match } = this.props
        if (!sessionsByDateAndTrack) return 'Data loading'
        return (
            <div>
                {sessionsByDateAndTrack.map((current, key) => (
                    <div key={key}>
                        <Typography variant="h5">
                            {moment(current.date).format('dddd D')}
                        </Typography>

                        {current.tracks.map((track, key) => (
                            <div key={key}>
                                <Typography variant="h6">
                                    {track.track}
                                </Typography>

                                <Grid container>
                                    {track.sessions.map((session, key) => (
                                        <SessionItem
                                            key={key}
                                            session={session}
                                            routerParams={match.params}
                                            onClick={this.onSessionClicked}
                                        />
                                    ))}
                                </Grid>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    sessionsByDateAndTrack: getSessionsGroupByDateAndTrack(state)
})

const mapDispatchToProps = Object.assign({}, sessionActions, speakerActions)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SessionList))
