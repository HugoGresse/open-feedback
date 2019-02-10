import { createSelector } from 'reselect'

import { getSpeakersList } from '../../speaker/core'
import {
    getSessions,
    getSessionsList
} from '../../sessions/core/sessionsSelectors'
import { getProjectVoteResults } from '../../project/projectSelectors'

export const getSession = state => state.session

export const getSelectedSessionId = state => getSession(state).selected
export const getSessionLoadError = state => getSession(state).errorSessionLoad

export const getSelectedSession = createSelector(
    getSessionsList,
    getSelectedSessionId,
    (sessions, selectedSessionId) => {
        return sessions[selectedSessionId]
    }
)

export const getSpeakersForSelectedSession = createSelector(
    getSelectedSession,
    getSpeakersList,
    (session, speakers) => {
        if (!session || !session.speakers) return []
        return Object.values(speakers).filter(speaker => {
            return session.speakers.includes(speaker.id)
        })
    }
)
export const getVoteResultSelector = createSelector(
    getSelectedSessionId,
    getProjectVoteResults,
    (selectedSessionId, voteResults) => {
        if (!voteResults || !voteResults[selectedSessionId]) {
            return []
        }
        return voteResults[selectedSessionId]
    }
)
