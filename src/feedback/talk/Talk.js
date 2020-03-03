import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import {
    getSelectedTalkSelector,
    getTalkLoadErrorSelector,
    getSpeakersForSelectedTalkSelector,
} from './core/talkSelectors'
import { getTalk, setSelectedTalk } from './core/talkActions'
import { getSpeakers } from '../../core/speakers/speakerActions'
import { getVoteResult } from '../project/projectActions'
import {
    getVotes,
    removeVote,
    removeVoteLoadError,
    removeVotePostError,
    updateVote,
    voteFor,
} from '../vote/voteActions'

import {
    getProjectChipColorsSelector,
    getProjectVoteItemsOrderedSelector,
} from '../project/projectSelectors'
import { getVoteResultSelectorSelector } from '../talk/core/talkSelectors'
import {
    getActiveUserVotesByTalkAndVoteItemSelector,
    getErrorVotePostSelector,
    getErrorVotesLoadSelector,
} from '../vote/voteSelectors'

import Grid from '@material-ui/core/Grid'
import TalkVote from './TalkVote'
import SpeakerList from '../speaker/SpeakerList'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import Error from '../../baseComponents/customComponent/Error'
import Snackbar from '../../baseComponents/customComponent/Snackbar'
import Title from '../../baseComponents/design/Title'
import { COLORS } from '../../constants/colors'
import { SPACING } from '../../constants/constants'
import { DateTime } from 'luxon'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../core/contants'

const Header = styled.div`
    margin-bottom: 30px;
`

const DateTimeContainer = styled.div`
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

class Talk extends Component {
    componentDidMount() {
        const id = this.props.match.params.talkId
        this.props.getTalk(id)
        this.props.setSelectedTalk(id)
        this.props.getSpeakers()
        this.props.getVoteResult()
    }

    getSpeakersString(talk, speakers) {
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
            this.props.voteFor(this.props.talk.id, voteItem, data)
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
            talk,
            voteItems,
            userVotes,
            voteResults,
            errorTalkLoad,
            errorVotePost,
            errorVotesLoad,
            chipColors,
        } = this.props

        if (errorTalkLoad) {
            return (
                <Error
                    error="Unable to load the talk/speakers/vote options"
                    errorDetail={errorTalkLoad}
                />
            )
        }

        if (!talk || !speakers || !voteItems) {
            return <LoaderMatchParent />
        }

        let snackBarError = null
        if (errorVotePost) {
            snackBarError = (
                <Snackbar
                    text={errorVotePost}
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
                        {talk.title}
                        <ChipList>
                            {talk.tags &&
                                talk.tags.map((tag, key) => (
                                    <span key={key}>#{tag}</span>
                                ))}
                        </ChipList>
                    </Title>
                    <DateTimeContainer>
                        {DateTime.fromISO(talk.startTime, {
                            setZone: true,
                        }).toLocaleString({
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })}
                        {' / '}
                        {DateTime.fromISO(talk.startTime, { setZone: true })
                            .setZone('local', { keepLocalTime: true })
                            .toLocaleString(DateTime.TIME_SIMPLE)}
                        {' - '}
                        {DateTime.fromISO(talk.endTime, {
                            setZone: true,
                        }).toLocaleString(DateTime.TIME_SIMPLE)}
                    </DateTimeContainer>
                    <SpeakerList speakers={speakers} />
                </Header>
                <Grid container spacing={SPACING.LAYOUT}>
                    {voteItems.map((voteItem, key) => (
                        <TalkVote
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
    talk: getSelectedTalkSelector(state),
    speakers: getSpeakersForSelectedTalkSelector(state),
    voteItems: getProjectVoteItemsOrderedSelector(state),
    userVotes: getActiveUserVotesByTalkAndVoteItemSelector(state),
    voteResults: getVoteResultSelectorSelector(state),
    errorTalkLoad: getTalkLoadErrorSelector(state),
    errorVotePost: getErrorVotePostSelector(state),
    errorVotesLoad: getErrorVotesLoadSelector(state),
    chipColors: getProjectChipColorsSelector(state),
})

const mapDispatchToProps = Object.assign(
    {},
    {
        getTalk: getTalk,
        setSelectedTalk: setSelectedTalk,
        getSpeakers: getSpeakers,
        getVoteResult: getVoteResult,
        voteFor: voteFor,
        removeVote: removeVote,
        updateVote: updateVote,
        removeVoteLoadError: removeVoteLoadError,
        removeVotePostError: removeVotePostError,
        getVotes: getVotes,
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(Talk)
