import { fireStoreMainInstance } from '../../../firebase.ts'

// A sessionVotes document maps each vote item id to either a counter
// (boolean/chip vote items) or a map of text votes keyed by vote id.
export type SessionVotes = Record<string, number | Record<string, unknown>>

export const countTalkVotes = (sessionVotes?: SessionVotes | null): number => {
    if (!sessionVotes) {
        return 0
    }
    return Object.values(sessionVotes).reduce<number>((total, value) => {
        if (typeof value === 'number') {
            return total + Math.max(value, 0)
        }
        if (value && typeof value === 'object') {
            return total + Object.keys(value).length
        }
        return total
    }, 0)
}

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
