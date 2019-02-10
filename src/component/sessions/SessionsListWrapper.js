import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSessions } from './core/sessionsActions'
import { setSelectedSession } from '../session/core/sessionActions'
import { speakerActions } from './../speaker/core'
import { setSelectedDate } from './../project/projectActions'
import { getVotesBySession } from '../vote/voteSelectors'

import {
    getSessionsLoadError,
    getCurrentSessionsGroupByTrack,
    getSessionsLoading
} from './core/sessionsSelectors'
import Error from '../customComponent/Error'
import LoaderMatchParent from '../customComponent/LoaderMatchParent'
import SessionsDateMenu from './SessionsDateMenu'
import SessionsList from './SessionsList'

class SessionsListWrapper extends Component {
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
                {!sessionIsLoading && currentSessionsByTrack.length > 0 && (
                    <SessionsList sessions={currentSessionsByTrack} />
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
