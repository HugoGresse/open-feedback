import { createSelector } from "reselect"

export const getSpeakersSelector = state => state.speakers

export const getSpeakersListSelector = state => getSpeakersSelector(state).list

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
