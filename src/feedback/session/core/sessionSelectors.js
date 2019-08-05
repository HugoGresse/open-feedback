import { createSelector } from 'reselect'

import { getSpeakersListSelector } from '../../speaker/core/speakerSelectors'
import { getSessionsListSelector } from '../../../core/sessions/sessionsSelectors'
import { getProjectVoteResultsSelector } from '../../project/projectSelectors'

export const getSessionSelector = state => state.session

export const getSelectedSessionIdSelector = state =>
    getSessionSelector(state).selected
export const getSessionLoadErrorSelector = state =>
    getSessionSelector(state).errorSessionLoad

export const getSelectedSessionSelector = createSelector(
    getSessionsListSelector,
    getSelectedSessionIdSelector,
    (sessions, selectedSessionId) => {
        return sessions[selectedSessionId]
    }
)

export const getSpeakersForSelectedSessionSelector = createSelector(
    getSelectedSessionSelector,
    getSpeakersListSelector,
    (session, speakers) => {
        if (!session || !session.speakers) return []
        return Object.values(speakers).filter(speaker => {
            return session.speakers.includes(speaker.id)
        })
    }
)
export const getVoteResultSelectorSelector = createSelector(
    getSelectedSessionIdSelector,
    getProjectVoteResultsSelector,
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
                    if (Object.keys(value2).length === 0) {
                        // Empty object due to deletion
                        return
                    }
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
