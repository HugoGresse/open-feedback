import type { AggregatedTalkVotes, Timestamp, Vote } from '../../../core/models'

export const GET_TALK_VOTES_SUCCESS = 'admin/dashboard/getTalkVotes/success'
export const GET_TALK_VOTES_ERROR = 'admin/dashboard/getTalkVotes/error'
export const CLEAR_TALK_VOTES = 'admin/dashboard/clearTalkVotes'
export const GET_USER_VOTES_SUCCESS = 'admin/dashboard/getUserVotes/success'
export const GET_USER_VOTES_ERROR = 'admin/dashboard/getUserVotes/error'

/** A `sessionVotes/{talkId}` document as loaded by the dashboard. */
export interface DashboardTalkVotes {
    id: string
    votes: AggregatedTalkVotes
}

/** A `userVotes/{voteId}` document as loaded by the dashboard. */
export interface DashboardUserVote
    extends Omit<Vote, 'createdAt' | 'updatedAt'> {
    fireStoreId: string
    /** Read back from Firestore, so never the serverTimestamp sentinel. */
    createdAt?: Timestamp | null
    updatedAt?: Timestamp | null
}

export type DashboardAction =
    | {
          type: typeof GET_TALK_VOTES_SUCCESS
          payload: Record<string, DashboardTalkVotes>
      }
    | { type: typeof GET_TALK_VOTES_ERROR; payload: string }
    | { type: typeof CLEAR_TALK_VOTES }
    | { type: typeof GET_USER_VOTES_SUCCESS; payload: DashboardUserVote[] }
    | { type: typeof GET_USER_VOTES_ERROR; payload: string }
