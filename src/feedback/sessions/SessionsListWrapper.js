import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSessions } from '../../core/sessions/sessionsActions'
import { setSelectedSession } from '../session/core/sessionActions'
import * as speakerActions from '../../core/speakers/speakerActions'
import { setSelectedDate } from './../project/projectActions'
import { getVotesBySessionSelector } from '../vote/voteSelectors'

import {
    getCurrentSessionsGroupByTrackSelector,
    getSessionsLoadError,
    isSessionsLoadingSelector
} from '../../core/sessions/sessionsSelectors'
import Error from '../../baseComponents/customComponent/Error'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import SessionsDateMenu from './SessionsDateMenu'
import SessionsList from './SessionsList'

class SessionsListWrapper extends Component {
    componentDidMount() {
        this.props.getSessions()
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
            errorSessionsLoad,
            currentSessionsByTrack,
            sessionIsLoading
        } = this.props

        if (errorSessionsLoad) {
            return (
                <Error
                    error="Unable to load the sessions. This is bad."
                    errorDetail={errorSessionsLoad}
                />
            )
        }

        if (
            sessionIsLoading &&
            (!currentSessionsByTrack || currentSessionsByTrack.length < 1)
        )
            return <LoaderMatchParent />

        return (
            <div>
                <SessionsDateMenu />

                {!sessionIsLoading && currentSessionsByTrack.length === 0 && (
                    <span>Oops there is nothing here</span>
                )}
                {currentSessionsByTrack.length > 0 && (
                    <SessionsList sessions={currentSessionsByTrack} />
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userSessionVote: getVotesBySessionSelector(state),
    errorSessionsLoad: getSessionsLoadError(state),
    currentSessionsByTrack: getCurrentSessionsGroupByTrackSelector(state),
    sessionIsLoading: isSessionsLoadingSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        getSessions: getSessions,
        setSelectedSession: setSelectedSession,
        getSpeakers: speakerActions.getSpeakers,
        setSelectedDate: setSelectedDate
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionsListWrapper)
