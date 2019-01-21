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
import {
    getProjectVoteItemsSelector,
    getVoteResultSelector
} from '../project/projectSelectors'
import * as projectActions from '../project/projectActions'
import * as voteActions from '../vote/voteActions'
import { getVotesBySessionAndVoteItemSelector } from '../vote/voteSelectors'
import SessionVoteItem from './SessionVoteItem'
import SpeakerList from '../speaker/SpeakerList'
import Chip from '../customComponent/Chip'

const styles = theme => ({
    arrowLink: {
        color: theme.palette.grey[800],
        marginRight: '20px'
    },
    header: {
        display: 'flex',
        marginBottom: '40px'
    },
    subHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px'
    },
    dateTime: {
        fontSize: '18px',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'right',
        color: theme.palette.grey[500]
    },
    time: {
        fontSize: '14px'
    },
    headerTitle: {
        width: '100%'
    }
})

class SessionVote extends Component {
    componentWillMount() {
        const id = this.props.match.params.sessionId
        this.props.getSession(id)
        this.props.setSelectedSession(id)
        this.props.getSpeakers()
        this.props.getVoteItems()
        this.props.getVoteResult()
    }

    getSpeakersString(session, speakers) {
        if (speakers.length === 0) {
            return ''
        }

        return speakers.reduce((acc, speaker) => {
            return acc + ' ' + speaker.name
        }, '')
    }

    onVoteItemClick = (event, voteItem) => {
        if (this.props.userVotes[voteItem.id]) {
            this.props.removeVote(this.props.userVotes[voteItem.id])
        } else {
            this.props.voteFor(this.props.session.id, voteItem.id)
        }
    }

    render() {
        const {
            classes,
            theme,
            speakers,
            session,
            match,
            voteItems,
            userVotes,
            voteResults
        } = this.props

        if (!session || !speakers || !voteItems) {
            return ''
        }

        return (
            <div>
                <div className={classes.header}>
                    <Link
                        className={classes.arrowLink}
                        to={`/${match.params.projectId}/`}
                    >
                        <ArrowBack />
                    </Link>
                    <div className={classes.headerTitle}>
                        {session.tags &&
                            session.tags.map((tag, key) => (
                                <Chip key={key} label={tag} />
                            ))}

                        <div className={classes.subHeader}>
                            <Typography
                                variant="h5"
                                id="modal-title"
                                className={classes.title}
                            >
                                {session.title}
                            </Typography>

                            <div className={classes.dateTime}>
                                {moment(session.startTime).format('dddd D')}
                                <div className={classes.time}>
                                    {moment(session.startTime).format('H:mm ')}-
                                    {moment(session.endTime).format(' H:mm')}
                                </div>
                            </div>
                        </div>

                        <SpeakerList speakers={speakers} />
                    </div>
                </div>
                <Grid
                    container
                    className={classes.layout}
                    spacing={theme.spacing.default}
                >
                    {voteItems.map((voteItem, key) => (
                        <SessionVoteItem
                            key={key}
                            voteItem={voteItem}
                            userVote={userVotes[voteItem.id]}
                            voteResult={voteResults[voteItem.id]}
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
    userVotes: getVotesBySessionAndVoteItemSelector(state),
    voteResults: getVoteResultSelector(state)
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
)(withStyles(styles, { withTheme: true })(SessionVote))
