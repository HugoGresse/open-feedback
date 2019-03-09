export const getSpeakers = state => state.speakers

export const getSpeakersList = state => getSpeakers(state).list

//  MEMOIZED SELECTORS HERE
