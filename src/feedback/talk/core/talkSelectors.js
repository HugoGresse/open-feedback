import { createSelector } from 'reselect'

import { getSpeakersListSelector } from '../../../core/speakers/speakerSelectors'
import { getTalksListSelector } from '../../../core/talks/talksSelectors'
import { getProjectVoteResultsSelector } from '../../project/projectSelectors'

export const getTalkSelector = state => state.talk

export const getSelectedTalkIdSelector = state =>
    getTalkSelector(state).selected
export const getTalkLoadErrorSelector = state =>
    getTalkSelector(state).errorTalkLoad

export const getSelectedTalkSelector = createSelector(
    getTalksListSelector,
    getSelectedTalkIdSelector,
    (talks, selectedTalkId) => {
        return talks[selectedTalkId]
    }
)

export const getSpeakersForSelectedTalkSelector = createSelector(
    getSelectedTalkSelector,
    getSpeakersListSelector,
    (talk, speakers) => {
        if (!talk || !talk.speakers) return []
        return Object.values(speakers).filter(speaker => {
            return talk.speakers.includes(speaker.id)
        })
    }
)
export const getVoteResultSelectorSelector = createSelector(
    getSelectedTalkIdSelector,
    getProjectVoteResultsSelector,
    (selectedTalkId, voteResults) => {
        if (!voteResults || !voteResults[selectedTalkId]) {
            return []
        }
        let results = voteResults[selectedTalkId]

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
                        createdAt: value2.createdAt.toDate(),
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
