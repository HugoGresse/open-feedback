import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTalks } from '../../core/talks/talksActions'
import { setSelectedTalk } from '../talk/core/talkActions'
import * as speakerActions from '../../core/speakers/speakerActions'
import { setSelectedDate } from './../project/projectActions'
import { getVotesByTalkSelector } from '../vote/voteSelectors'

import {
    getCurrentTalksGroupByTrackSelector,
    getTalksLoadError,
    isTalksLoadingSelector,
} from '../../core/talks/talksSelectors'
import Error from '../../baseComponents/customComponent/Error'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import TalksDateMenu from './TalksDateMenu'
import TalksList from './TalksList'

class TalksListWrapper extends Component {
    componentDidMount() {
        this.props.getTalks()
        this.props.getSpeakers()

        const currentDate = this.props.match.params.date
        this.props.setSelectedDate(currentDate)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const newDate = this.props.match.params.date
        const oldDate = prevProps.match.params.date
        if (oldDate !== newDate) {
            this.props.setSelectedDate(newDate)
        }
    }

    render() {
        const {
            errorTalksLoad,
            currentTalksByTrack,
            talkIsLoading,
        } = this.props

        if (errorTalksLoad) {
            return (
                <Error
                    error="Unable to load the talks. This is bad."
                    errorDetail={errorTalksLoad}
                />
            )
        }

        if (
            talkIsLoading &&
            (!currentTalksByTrack || currentTalksByTrack.length < 1)
        )
            return <LoaderMatchParent />

        return (
            <div>
                <TalksDateMenu />

                {!talkIsLoading && currentTalksByTrack.length === 0 && (
                    <span>Oops there is nothing here</span>
                )}
                {currentTalksByTrack.length > 0 && (
                    <TalksList talks={currentTalksByTrack} />
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userTalkVote: getVotesByTalkSelector(state),
    errorTalksLoad: getTalksLoadError(state),
    currentTalksByTrack: getCurrentTalksGroupByTrackSelector(state),
    talkIsLoading: isTalksLoadingSelector(state),
})

const mapDispatchToProps = Object.assign(
    {},
    {
        getTalks: getTalks,
        setSelectedTalk: setSelectedTalk,
        getSpeakers: speakerActions.getSpeakers,
        setSelectedDate: setSelectedDate,
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(TalksListWrapper)
