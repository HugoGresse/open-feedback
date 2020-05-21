import React, { Component } from 'react'
import { connect } from 'react-redux'

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
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import Error from '../../baseComponents/customComponent/Error'
import Snackbar from '../../baseComponents/customComponent/Snackbar'
import { SPACING } from '../../constants/constants'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../core/contants'
import { withTranslation } from 'react-i18next'
import TalkHeader from './TalkHeader'

class Talk extends Component {
    componentDidMount() {
        const id = this.props.match.params.talkId
        this.props.getTalk(id)
        this.props.setSelectedTalk(id)
        this.props.getSpeakers()
        this.props.getVoteResult(id)
    }

    onVoteItemChange = (voteItem, data) => {
        if (this.props.userVotes[voteItem.id]) {
            switch (voteItem.type) {
                case VOTE_TYPE_TEXT:
                    if (data && data.length > 0) {
                        this.props.updateVote(
                            this.props.userVotes[voteItem.id],
                            data,
                            this.props.t
                        )
                    } else {
                        this.props.removeVote(
                            this.props.userVotes[voteItem.id],
                            this.props.t
                        )
                    }
                    break
                default:
                case VOTE_TYPE_BOOLEAN:
                    this.props.removeVote(
                        this.props.userVotes[voteItem.id],
                        this.props.t
                    )
                    break
            }
        } else {
            this.props.voteFor(this.props.talk.id, voteItem, data, this.props.t)
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
                <TalkHeader talk={talk} speakers={speakers} />
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

const mapStateToProps = (state) => ({
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation()(Talk))
