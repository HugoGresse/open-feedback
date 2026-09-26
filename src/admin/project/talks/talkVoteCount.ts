import { fireStoreMainInstance } from '../../../firebase.ts'

// A sessionVotes document maps each vote item id to either a counter
// (boolean/chip vote items) or a map of text votes keyed by vote id.
// Deleted text votes stay in the map as empty objects.
export type SessionVotes = Record<string, number | Record<string, unknown>>

export interface TalkVoteCounts {
    votes: number
    comments: number
}

const isActiveTextVote = (value: unknown): boolean =>
    !!value && typeof value === 'object' && 'text' in value

export const countTalkVotesAndComments = (
    sessionVotes?: SessionVotes | null
): TalkVoteCounts => {
    const counts: TalkVoteCounts = { votes: 0, comments: 0 }
    if (!sessionVotes) {
        return counts
    }
    for (const value of Object.values(sessionVotes)) {
        if (typeof value === 'number') {
            counts.votes += Math.max(value, 0)
        } else if (value && typeof value === 'object') {
            const comments =
                Object.values(value).filter(isActiveTextVote).length
            counts.votes += comments
            counts.comments += comments
        }
    }
    return counts
}

export const countTalkVotes = (sessionVotes?: SessionVotes | null): number =>
    countTalkVotesAndComments(sessionVotes).votes

// null means the vote count could not be read: ask rather than delete.
export const shouldConfirmTalkRemoval = (voteCount: number | null): boolean =>
    voteCount !== 0

export const getTalkVoteCount = async (
    projectId: string,
    talkId: string
): Promise<number> => {
    const snapshot = await fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .collection('sessionVotes')
        .doc(talkId)
        .get()
    return countTalkVotes(snapshot.data() as SessionVotes | undefined)
}
