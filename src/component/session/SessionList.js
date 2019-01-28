import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSessionsGroupByDateAndTrack, sessionActions } from './core'
import { speakerActions } from './../speaker/core'
import SessionItem from './SessionItem'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { getVotesBySession } from '../vote/voteSelectors'
import { getSessionsLoadError } from './core/sessionSelectors'
import Error from '../customComponent/Error'
import LoaderMatchParent from '../customComponent/LoaderMatchParent'

const styles = theme => ({
    expansionPanel: {
        // boxShadow: 'none'
    },
    DateAndTrackBlock: {
        marginBottom: '80px',
        display: 'block'
    },
    dateTitle: {},
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
        const {
            sessionsByDateAndTrack,
            match,
            theme,
            userSessionVote,
            errorSessionsLoad,
            classes
        } = this.props

        if (errorSessionsLoad) {
            return (
                <Error
                    error="Unable to load the sessions. This is bad."
                    errorDetail={errorSessionsLoad}
                />
            )
        }

        if (!sessionsByDateAndTrack || sessionsByDateAndTrack.length < 1)
            return <LoaderMatchParent />

        return (
            <div>
                {sessionsByDateAndTrack.map((current, key) => (
                    <ExpansionPanel
                        key={key}
                        defaultExpanded={true}
                        className={classes.expansionPanel}
                    >
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography
                                className={classes.dateTitle}
                                variant="h5"
                            >
                                {moment(current.date).format('dddd D')}
                            </Typography>
                        </ExpansionPanelSummary>

                        <ExpansionPanelDetails
                            className={classes.DateAndTrackBlock}
                        >
                            {current.tracks.map((track, key) => (
                                <div key={key}>
                                    <Typography
                                        className={classes.trackTitle}
                                        variant="h6"
                                    >
                                        {track.track}
                                    </Typography>

                                    <Grid
                                        container
                                        spacing={theme.spacing.default}
                                    >
                                        {track.sessions.map((session, key) => (
                                            <SessionItem
                                                key={key}
                                                session={session}
                                                routerParams={match.params}
                                                userVote={
                                                    userSessionVote[session.id]
                                                }
                                                onClick={this.onSessionClicked}
                                            />
                                        ))}
                                    </Grid>
                                </div>
                            ))}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    sessionsByDateAndTrack: getSessionsGroupByDateAndTrack(state),
    userSessionVote: getVotesBySession(state),
    errorSessionsLoad: getSessionsLoadError(state)
})

const mapDispatchToProps = Object.assign({}, sessionActions, speakerActions)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(SessionList))
