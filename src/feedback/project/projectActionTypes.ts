import type firebase from 'firebase/compat/app'
import type { Project, TalkVotes, Vote } from '../../core/models'

export const GET_PROJECT_SUCCESS = 'project/get/success'
export const GET_PROJECT_ERROR = 'project/get/error'
export const GET_PROJECT_NOTFOUND = 'project/get/notFound'
export const GET_PROJECT_VOTE_RESULT_SUCCESS = 'project/getVoteResult/success'
export const GET_PROJECT_VOTE_RESULT_ERROR = 'project/getVoteResult/error'
export const INCREMENT_VOTE_LOCALLY = 'project/incrementVoteLocally'
export const SET_SELECTED_DATE = 'project/setSelectedDate'

/**
 * The vote applied to the aggregated results before Firestore confirms it.
 * For an up-vote ("+1") on a text vote, `id` is the up-voted text vote id and
 * `plus` is set.
 */
export interface LocalVote extends Omit<Vote, 'pending'> {
    plus?: number
}

export interface IncrementVoteLocallyPayload {
    vote: LocalVote
    /** 1 to add the vote, -1 to remove it, missing to update a text vote. */
    amount?: number
}

/** Aggregated votes of one talk as dispatched once read from Firestore. */
export type LoadedTalkVotes = TalkVotes & { id: string }

export type ProjectAction =
    | { type: typeof GET_PROJECT_SUCCESS; payload: Project }
    | { type: typeof GET_PROJECT_ERROR; payload: string }
    | { type: typeof GET_PROJECT_NOTFOUND }
    | { type: typeof GET_PROJECT_VOTE_RESULT_SUCCESS; payload: LoadedTalkVotes }
    | {
          type: typeof GET_PROJECT_VOTE_RESULT_ERROR
          payload: firebase.firestore.FirestoreError
      }
    | {
          type: typeof INCREMENT_VOTE_LOCALLY
          payload: IncrementVoteLocallyPayload
      }
    | { type: typeof SET_SELECTED_DATE; payload: { date: string } }
