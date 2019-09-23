export const getSpeakersSelector = state => state.speakers

export const getSpeakersListSelector = state => getSpeakersSelector(state).list

//  MEMOIZED SELECTORS HERE
