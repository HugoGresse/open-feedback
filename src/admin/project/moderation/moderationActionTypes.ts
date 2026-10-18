import type { Timestamp, VoteStatus } from '../../../core/models'

export const GET_TEXT_VOTES_SUCCESS = 'admin/moderation/getTextVotes/success'
export const GET_TEXT_VOTES_ERROR = 'admin/moderation/getTextVotes/error'
export const HIDE_VOTE_SUCCESS = 'admin/moderation/hideVoteSuccess'
export const UNHIDE_VOTE_SUCCESS = 'admin/moderation/unhideVoteSuccess'

/**
 * A text vote listed in the moderation page: an active one read from the
 * `sessionVotes` aggregation, or a hidden one read from `userVotes`.
 */
export interface ModerationTextVote {
    voteId: string
    talkId: string
    status: VoteStatus
    text?: string
    userId?: string
    /** Number of up-votes (active votes only). */
    plus?: number
    createdAt?: Timestamp | null
    updatedAt: Timestamp
}

/** Text votes keyed by talk id. */
export type ModerationTextVotes = Record<string, ModerationTextVote[]>

export type ModerationAction =
    | { type: typeof GET_TEXT_VOTES_SUCCESS; payload: ModerationTextVotes }
    | { type: typeof GET_TEXT_VOTES_ERROR; payload: string }
    | { type: typeof HIDE_VOTE_SUCCESS; payload: ModerationTextVote }
    | { type: typeof UNHIDE_VOTE_SUCCESS; payload: ModerationTextVote }
