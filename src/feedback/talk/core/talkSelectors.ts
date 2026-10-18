import { createSelector } from 'reselect'
import { getSpeakersListSelector } from '../../../core/speakers/speakerSelectors'
import { getTalksListSelector } from '../../../core/talks/talksSelectors'

export const getTalkSelector = (state) => state.talk

export const getSelectedTalkIdSelector = (state) =>
    getTalkSelector(state).selected
export const getTalkLoadErrorSelector = (state) =>
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
        return Object.values(speakers).filter((speaker) => {
            return talk.speakers.includes(speaker.id)
        })
    }
)
