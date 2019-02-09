import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sessionActions } from './core'
import { speakerActions } from './../speaker/core'
import { setSelectedDate } from './../project/projectActions'
import SessionItem from './SessionItem'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core'
import { getVotesBySession } from '../vote/voteSelectors'
import Title from '../design/Title'

import {
    getSessionsLoadError,
    getCurrentSessionsGroupByTrack
} from './core/sessionSelectors'
import Error from '../customComponent/Error'
import LoaderMatchParent from '../customComponent/LoaderMatchParent'
import SessionDateMenu from './SessionDateMenu'

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

        const currentDate = this.props.match.params.date
        console.log(this.props.match)
        this.props.setSelectedDate(currentDate)
    }

    componentWillReceiveProps(nextProps) {
        const newDate = nextProps.match.params.date
        const oldDate = this.props.match.params.date
        if (oldDate !== newDate) {
            this.props.setSelectedDate(newDate)
        }
    }

    onSessionClicked = session => {
        this.props.setSelectedSession(session.id)
    }

    render() {
        const {
            theme,
            userSessionVote,
            errorSessionsLoad,
            currentSessionsByTrack
        } = this.props

        if (errorSessionsLoad) {
            return (
                <Error
                    error="Unable to load the sessions. This is bad."
                    errorDetail={errorSessionsLoad}
                />
            )
        }

        if (!currentSessionsByTrack || currentSessionsByTrack.length < 1)
            return <LoaderMatchParent />

        return (
            <div>
                <SessionDateMenu />

                {currentSessionsByTrack.map((track, key) => (
                    <div key={key}>
                        <Title
                            component="h3"
                            fontSize={20}
                            fontWeight={400}
                            mt={40}
                            mb={30}
                        >
                            {track.track}
                        </Title>

                        <Grid container spacing={theme.spacing.default}>
                            {track.sessions.map((session, key) => (
                                <SessionItem
                                    key={key}
                                    session={session}
                                    userVote={userSessionVote[session.id]}
                                    onClick={this.onSessionClicked}
                                />
                            ))}
                        </Grid>
                    </div>
                ))}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userSessionVote: getVotesBySession(state),
    errorSessionsLoad: getSessionsLoadError(state),
    currentSessionsByTrack: getCurrentSessionsGroupByTrack(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        getSessions: sessionActions.getSessions,
        setSelectedSession: sessionActions.setSelectedSession,
        getSpeakers: speakerActions.getSpeakers,
        setSelectedDate: setSelectedDate
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(SessionList))
