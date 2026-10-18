import { normalizeAndRemoveDiacritics } from '../../utils/stringUtils'
import { createAppSelector, type RootState } from '../../store'
import type { Speaker } from '../models'

export const getSpeakersSelector = (state: RootState) => state.speakers

export const getSpeakersListSelector = (state: RootState) =>
    getSpeakersSelector(state).list || {}

export const getSpeakersFilter = (state: RootState) =>
    getSpeakersSelector(state).filter

//  MEMOIZED SELECTORS HERE

export const getSpeakersAsArraySelector = createAppSelector(
    getSpeakersListSelector,
    (speakers) => {
        return Object.keys(speakers).reduce<Speaker[]>((acc, id) => {
            acc.push(speakers[id])
            return acc
        }, [])
    }
)

export const getFilteredSpeakers = createAppSelector(
    getSpeakersAsArraySelector,
    getSpeakersFilter,
    (speakers, filter) => {
        if (!filter) {
            return speakers
        }
        const cleanedFilter = normalizeAndRemoveDiacritics(
            filter.trim().toLowerCase()
        )
        return speakers.filter((speaker) =>
            normalizeAndRemoveDiacritics(speaker.name.toLowerCase()).includes(
                cleanedFilter
            )
        )
    }
)
