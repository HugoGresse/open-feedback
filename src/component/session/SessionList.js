import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSessionsGroupByDateAndTrack, sessionActions } from './core'
import { speakerActions } from './../speaker/core'
import SessionItem from './SessionItem'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'

const styles = theme => ({
    DateAndTrackBlock: {
        marginBottom: '80px'
    },
    dateTitle: {
        background: theme.palette.grey[100],
        padding: '10px 20px',
        margin: '0px -20px 10px -20px'
    },
    trackTitle: {
        marginTop: '20px',
        marginBottom: '10px'
    }
})

class SessionList extends Component {
    componentWillMount() {
        this.props.getSessions()
        this.props.getSpeakers()
    }

    onSessionClicked = session => {
        this.props.setSelectedSession(session.id)
    }

    render() {
        const { sessionsByDateAndTrack, match, theme, classes } = this.props
        if (!sessionsByDateAndTrack) return 'Data loading'
        return (
            <div>
                {sessionsByDateAndTrack.map((current, key) => (
                    <div className={classes.DateAndTrackBlock} key={key}>
                        <Typography className={classes.dateTitle} variant="h5">
                            {moment(current.date).format('dddd D')}
                        </Typography>

                        {current.tracks.map((track, key) => (
                            <div key={key}>
                                <Typography
                                    className={classes.trackTitle}
                                    variant="h6"
                                >
                                    {track.track}
                                </Typography>

                                <Grid container spacing={theme.spacing.default}>
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
)(withStyles(styles, { withTheme: true })(SessionList))
