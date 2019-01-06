const getVotes = state => state.votes

export const getVotesSelector = state => getVotes(state).votes
