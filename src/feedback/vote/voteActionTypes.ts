import type firebase from 'firebase/compat/app'
import type { Vote, VotesMap } from '../../core/models'

export const ADD_VOTE_BEFORE_SUCCESS = 'vote/add/beforeSuccess'
export const ADD_VOTE_SUCCESS = 'vote/add/success'
export const ADD_VOTE_ERROR = 'vote/add/error'
export const REMOVE_VOTE_SUCCESS = 'vote/remove/success'
export const REMOVE_VOTE_BEFORE_SUCCESS = 'vote/remove/beforeSuccess'
export const GET_USER_VOTES_SUCCESS = 'vote/getUserVote/success'
export const GET_USER_VOTES_ERROR = 'vote/getUserVote/error'
export const DELETE_VOTE_POST_ERROR = 'vote/delete/postError'
export const DELETE_VOTE_LOAD_ERROR = 'vote/delete/loadError'
export const UPDATE_VOTE_SUCCESS = 'vote/update/success'
export const UPDATE_VOTE_ERROR = 'vote/update/error'

/** Also handled by the project reducer. */
export type AddVoteSuccessAction = {
    type: typeof ADD_VOTE_SUCCESS
    payload: { voteId: string }
}

export interface AddVoteErrorPayload {
    error: string
    /** The optimistic vote to drop from the user votes. */
    voteId?: string
    voteWhichShouldHaveBeenDeleted?: Vote
}

export type VoteAction =
    | { type: typeof ADD_VOTE_BEFORE_SUCCESS; payload: VotesMap }
    | AddVoteSuccessAction
    | { type: typeof ADD_VOTE_ERROR; payload: AddVoteErrorPayload }
    | { type: typeof REMOVE_VOTE_BEFORE_SUCCESS; payload: Vote }
    | { type: typeof REMOVE_VOTE_SUCCESS; payload: Vote }
    | { type: typeof GET_USER_VOTES_SUCCESS; payload: VotesMap }
    | {
          type: typeof GET_USER_VOTES_ERROR
          payload: firebase.firestore.FirestoreError
      }
    | { type: typeof DELETE_VOTE_POST_ERROR }
    | { type: typeof DELETE_VOTE_LOAD_ERROR }
    | { type: typeof UPDATE_VOTE_SUCCESS; payload: { vote: VotesMap } }
    | {
          type: typeof UPDATE_VOTE_ERROR
          payload: { error: string; voteId: string }
      }
