import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setSelectedSession } from '../session/core/sessionActions'
import SessionsItem from './SessionsItem'
import Grid from '@material-ui/core/Grid'
import { getVotesBySessionSelector } from '../vote/voteSelectors'
import Title from '../../baseComponents/design/Title'

import { getCurrentSessionsGroupByTrackSelector } from '../../core/sessions/sessionsSelectors'

class SessionsList extends Component {
    onSessionClicked = session => {
        this.props.setSelectedSession(session.id)
    }

    render() {
        const { userSessionVote, sessions } = this.props

        return sessions.map((track, key) => (
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

                <Grid container spacing={2}>
                    {track.sessions.map((session, key) => (
                        <SessionsItem
                            key={key}
                            session={session}
                            userVote={userSessionVote[session.id]}
                            onClick={this.onSessionClicked}
                        />
                    ))}
                </Grid>
            </div>
        ))
    }
}

const mapStateToProps = state => ({
    userSessionVote: getVotesBySessionSelector(state),
    currentSessionsByTrack: getCurrentSessionsGroupByTrackSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        setSelectedSession: setSelectedSession
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionsList)
