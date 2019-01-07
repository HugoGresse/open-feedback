import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    getSelectedSession,
    getSpeakersForSelectedSession,
    sessionActions
} from './core'
import { speakerActions } from '../speaker/core'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import ArrowBack from '@material-ui/icons/ArrowBack'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { getProjectVoteItemsSelector } from '../project/projectSelectors'
import * as projectActions from '../project/projectActions'
import * as voteActions from '../vote/voteActions'
import { getVotesBySessionAndVoteItemSelector } from '../vote/voteSelectors'
import SessionVoteItem from './SessionVoteItem'

const styles = theme => ({})

class SessionVote extends Component {
    componentWillMount() {
        const id = this.props.match.params.sessionId
        this.props.getSession(id)
        this.props.setSelectedSession(id)
        this.props.getSpeakers()
        this.props.getVoteItems()
    }

    getSpeakersString(session, speakers) {
        if (speakers.length === 0) {
            return ''
        }

        return speakers.reduce((acc, speaker) => {
            return acc + ' ' + speaker.name
        }, '')
    }

    onVoteItemClick = (event, vote) => {
        this.props.voteFor(this.props.session.id, vote.id)
    }

    render() {
        const {
            classes,
            speakers,
            session,
            match,
            voteItems,
            userVotes
        } = this.props

        if (!session || !speakers || !voteItems) {
            return ''
        }

        return (
            <div>
                <Link to={`/${match.params.projectId}/`}>
                    <ArrowBack />
                </Link>

                <Typography variant="h2" id="modal-title">
                    {session.title}
                </Typography>

                <Typography variant="h5" id="modal-title">
                    {moment(session.startTime).format('dddd D, H:m ')}
                    to
                    {moment(session.endTime).format(' H:m')}
                </Typography>

                <Typography variant="h6">
                    Speaker(s): {this.getSpeakersString(session, speakers)}
                </Typography>

                <Grid container className={classes.layout}>
                    {voteItems.map((vote, key) => (
                        <SessionVoteItem
                            key={key}
                            voteItem={vote}
                            userVote={userVotes[vote.id]}
                            onClick={this.onVoteItemClick}
                        />
                    ))}
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    session: getSelectedSession(state),
    speakers: getSpeakersForSelectedSession(state),
    voteItems: getProjectVoteItemsSelector(state),
    userVotes: getVotesBySessionAndVoteItemSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    sessionActions,
    speakerActions,
    projectActions,
    voteActions
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SessionVote))
