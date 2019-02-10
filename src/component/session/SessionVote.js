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
    getProjectChipColors,
    getProjectVoteItemsOrderedSelector,
    getVoteResultSelector
} from '../project/projectSelectors'
import * as projectActions from '../project/projectActions'
import * as voteActions from '../vote/voteActions'
import {
    getErrorVotePostSelector,
    getErrorVotesLoadSelector,
    getUserVotesBySessionAndVoteItemSelector
} from '../vote/voteSelectors'
import SessionVoteItem from './SessionVoteItem'
import SpeakerList from '../speaker/SpeakerList'
import Chip from '../customComponent/Chip'
import LoaderMatchParent from '../customComponent/LoaderMatchParent'
import { getSessionLoadError } from './core/sessionSelectors'
import Error from '../customComponent/Error'
import Snackbar from '../customComponent/Snackbar'

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
            this.props.voteFor(this.props.session.id, voteItem)
        }
    }

    onRetryLoadVotesClick = () => {
        this.props.removeVoteLoadError()
        this.props.getVotes()
    }

    closeErrorVotePostClick = () => {
        this.props.removeVotePostError()
    }

    closeErrorVoteLoadClick = () => {
        this.props.removeVoteLoadError()
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
            voteResults,
            errorSessionLoad,
            errorVotePost,
            errorVotesLoad,
            chipColors
        } = this.props

        if (errorSessionLoad) {
            return (
                <Error
                    error="Unable to load the session/speakers/vote options"
                    errorDetail={errorSessionLoad}
                />
            )
        }

        if (!session || !speakers || !voteItems) {
            return <LoaderMatchParent />
        }

        let snackBarError = null
        if (errorVotePost) {
            snackBarError = (
                <Snackbar
                    text={'Unable to save the vote, reason: ' + errorVotePost}
                    closeCallback={this.closeErrorVotePostClick}
                />
            )
        }

        if (errorVotesLoad) {
            snackBarError = (
                <Snackbar
                    text={
                        'Unable to load the vote results, reason: ' +
                        errorVotePost
                    }
                    actionText="Retry"
                    actionCallback={this.onRetryLoadVotesClick}
                    closeCallback={this.closeErrorVoteLoadClick}
                />
            )
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
                            chipColors={chipColors}
                            onClick={this.onVoteItemClick}
                        />
                    ))}
                </Grid>
                {snackBarError}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    session: getSelectedSession(state),
    speakers: getSpeakersForSelectedSession(state),
    voteItems: getProjectVoteItemsOrderedSelector(state),
    userVotes: getUserVotesBySessionAndVoteItemSelector(state),
    voteResults: getVoteResultSelector(state),
    errorSessionLoad: getSessionLoadError(state),
    errorVotePost: getErrorVotePostSelector(state),
    errorVotesLoad: getErrorVotesLoadSelector(state),
    chipColors: getProjectChipColors(state)
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
