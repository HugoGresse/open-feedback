import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sessionActions } from './core'
import { speakerActions } from './../speaker/core'
import { setSelectedDate } from './../project/projectActions'
import { getVotesBySession } from '../vote/voteSelectors'

import {
    getSessionsLoadError,
    getCurrentSessionsGroupByTrack,
    getSessionsLoading
} from './core/sessionSelectors'
import Error from '../customComponent/Error'
import LoaderMatchParent from '../customComponent/LoaderMatchParent'
import SessionDateMenu from './SessionDateMenu'
import SessionList from './SessionList'

class SessionListWrapper extends Component {
    componentWillMount() {
        this.props.getSessions()
        this.props.getSpeakers()

        const currentDate = this.props.match.params.date
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
                <SessionDateMenu />

                {!sessionIsLoading && currentSessionsByTrack.length === 0 && (
                    <span>Oops there is nothing here</span>
                )}
                {!sessionIsLoading && currentSessionsByTrack.length > 0 && (
                    <SessionList sessions={currentSessionsByTrack} />
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userSessionVote: getVotesBySession(state),
    errorSessionsLoad: getSessionsLoadError(state),
    currentSessionsByTrack: getCurrentSessionsGroupByTrack(state),
    sessionIsLoading: getSessionsLoading(state)
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
)(SessionListWrapper)
