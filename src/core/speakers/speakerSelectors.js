import { createSelector } from "reselect"
import { normalizeAndRemoveDiacritics } from "../../utils/stringUtils"

export const getSpeakersSelector = state => state.speakers

export const getSpeakersListSelector = state => getSpeakersSelector(state).list

export const getSpeakersFilter = state => getSpeakersSelector(state).filter

//  MEMOIZED SELECTORS HERE

export const getSpeakersAsArraySelector = createSelector(
    getSpeakersListSelector,
    speakers => {
        return Object.keys(speakers).reduce((acc, id) => {
            acc.push(speakers[id])
            return acc
        }, [])
    }
)

export const getFilteredSpeakers = createSelector(
    getSpeakersAsArraySelector,
    getSpeakersFilter,
    (speakers, filter) => {
        if(!filter) {
            return speakers
        }
        const cleanedFilter = normalizeAndRemoveDiacritics(filter.trim().toLowerCase())
        return speakers.filter(speaker => normalizeAndRemoveDiacritics(speaker.name.toLowerCase()).includes(cleanedFilter))
    }
)
