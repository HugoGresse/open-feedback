import { createAppSelector, type RootState } from '../../../store'
import { getSpeakersListSelector } from '../../../core/speakers/speakerSelectors'
import { getTalksListSelector } from '../../../core/talks/talksSelectors'

export const getTalkSelector = (state: RootState) => state.talk

export const getSelectedTalkIdSelector = (state: RootState) =>
    getTalkSelector(state).selected
export const getTalkLoadErrorSelector = (state: RootState) =>
    getTalkSelector(state).errorTalkLoad

export const getSelectedTalkSelector = createAppSelector(
    getTalksListSelector,
    getSelectedTalkIdSelector,
    (talks, selectedTalkId) => {
        return selectedTalkId === null ? undefined : talks[selectedTalkId]
    }
)

export const getSpeakersForSelectedTalkSelector = createAppSelector(
    getSelectedTalkSelector,
    getSpeakersListSelector,
    (talk, speakers) => {
        if (!talk || !talk.speakers) return []
        const talkSpeakers = talk.speakers
        return Object.values(speakers).filter((speaker) => {
            return talkSpeakers.includes(speaker.id)
        })
    }
)
