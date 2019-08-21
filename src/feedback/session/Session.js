import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import styled from 'styled-components'

import {
    getSelectedSessionSelector,
    getSessionLoadErrorSelector,
    getSpeakersForSelectedSessionSelector
} from './core/sessionSelectors'
import { getSession, setSelectedSession } from './core/sessionActions'
import { getSpeakers } from '../speaker/core/speakerActions'
import { getVoteItems, getVoteResult } from '../project/projectActions'
import {
    getVotes,
    removeVote,
    removeVoteLoadError,
    removeVotePostError,
    updateVote,
    voteFor
} from '../vote/voteActions'

import {
    getProjectChipColorsSelector,
    getProjectVoteItemsOrderedSelector
} from '../project/projectSelectors'
import { getVoteResultSelectorSelector } from '../session/core/sessionSelectors'
import {
    getErrorVotePostSelector,
    getErrorVotesLoadSelector,
    getUserVotesBySessionAndVoteItemSelector
} from '../vote/voteSelectors'

import Grid from '@material-ui/core/Grid'
import SessionVote from './SessionVote'
import SpeakerList from '../speaker/SpeakerList'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import Error from '../../baseComponents/customComponent/Error'
import Snackbar from '../../baseComponents/customComponent/Snackbar'
import Title from '../../baseComponents/design/Title'
import { COLORS } from '../../constants/colors'
import { SPACING } from '../../constants/constants'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../vote/voteReducer'

const Header = styled.div`
    margin-bottom: 30px;
`

const DateTime = styled.div`
    font-size: '18px';
    display: 'flex';
    flex-direction: 'column';
    color: ${COLORS.GRAY};
    margin-bottom: 15px;
`

const ChipList = styled.span`
    font-size: 20px;
    color: ${COLORS.GRAY};
    margin-left: 5px;
`

class Session extends Component {
    componentDidMount() {
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

    onVoteItemChange = (voteItem, data) => {
        if (this.props.userVotes[voteItem.id]) {
            switch (voteItem.type) {
                case VOTE_TYPE_TEXT:
                    if (data && data.length > 0) {
                        this.props.updateVote(
                            this.props.userVotes[voteItem.id],
                            data
                        )
                    } else {
                        this.props.removeVote(this.props.userVotes[voteItem.id])
                    }
                    break
                default:
                case VOTE_TYPE_BOOLEAN:
                    this.props.removeVote(this.props.userVotes[voteItem.id])
                    break
            }
        } else {
            this.props.voteFor(this.props.session.id, voteItem, data)
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
            speakers,
            session,
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
                <Header>
                    <Title mb="15px">
                        {session.title}
                        <ChipList>
                            {session.tags &&
                                session.tags.map((tag, key) => (
                                    <span key={key}>#{tag}</span>
                                ))}
                        </ChipList>
                    </Title>
                    <DateTime>
                        {moment(session.startTime).format('dddd D')} /{' '}
                        {moment(session.startTime).format('H:mm ')}-
                        {moment(session.endTime).format(' H:mm')}
                    </DateTime>
                    <SpeakerList speakers={speakers} />
                </Header>
                <Grid container spacing={SPACING.LAYOUT}>
                    {voteItems.map((voteItem, key) => (
                        <SessionVote
                            key={key}
                            voteItem={voteItem}
                            userVote={userVotes[voteItem.id]}
                            voteResult={voteResults[voteItem.id]}
                            chipColors={chipColors}
                            onVoteChange={this.onVoteItemChange}
                        />
                    ))}
                </Grid>
                {snackBarError}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    session: getSelectedSessionSelector(state),
    speakers: getSpeakersForSelectedSessionSelector(state),
    voteItems: getProjectVoteItemsOrderedSelector(state),
    userVotes: getUserVotesBySessionAndVoteItemSelector(state),
    voteResults: getVoteResultSelectorSelector(state),
    errorSessionLoad: getSessionLoadErrorSelector(state),
    errorVotePost: getErrorVotePostSelector(state),
    errorVotesLoad: getErrorVotesLoadSelector(state),
    chipColors: getProjectChipColorsSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        getSession: getSession,
        setSelectedSession: setSelectedSession,
        getSpeakers: getSpeakers,
        getVoteItems: getVoteItems,
        getVoteResult: getVoteResult,
        voteFor: voteFor,
        removeVote: removeVote,
        updateVote: updateVote,
        removeVoteLoadError: removeVoteLoadError,
        removeVotePostError: removeVotePostError,
        getVotes: getVotes
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Session)
