// A text vote as stored in the aggregate. Deleting it leaves an empty object.
export type AggregatedTextVote = {
    text?: string
    createdAt?: unknown
    updatedAt?: unknown
    userId?: string
    plus?: number
}

// Keyed by vote item id: a boolean vote item holds its vote count, a text
// vote item holds its text votes keyed by vote id.
export type AggregatedVote = {
    [voteItemId: string]:
        | number
        | { [voteId: string]: AggregatedTextVote | undefined }
        | undefined
}

export const getAggregatedTextVotes = (
    aggregatedVote: AggregatedVote | undefined,
    voteItemId: string
) => {
    const voteItem = aggregatedVote?.[voteItemId]
    return typeof voteItem === 'object' ? voteItem : undefined
}
