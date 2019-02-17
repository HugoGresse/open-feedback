import { createSelector } from 'reselect'

import { getSpeakersList } from '../../speaker/core'
import { getSessionsList } from '../../sessions/core/sessionsSelectors'
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
        let results = voteResults[selectedSessionId]

        // Transform results.id.{ id: voteText1, id: voteText2, id: voteText3} into an array
        let transformResult = {}
        Object.entries(results).forEach(([key, value]) => {
            if (typeof value === 'object') {
                transformResult[key] = []
                Object.entries(value).forEach(([key2, value2]) => {
                    transformResult[key].push({
                        ...value2,
                        updatedAt: value2.updatedAt.toDate(),
                        createdAt: value2.createdAt.toDate()
                    })
                })
                transformResult[key] = transformResult[key].sort(
                    (a, b) => b.updatedAt - a.updatedAt
                )
            } else {
                transformResult[key] = value
            }
        })

        return transformResult
    }
)
