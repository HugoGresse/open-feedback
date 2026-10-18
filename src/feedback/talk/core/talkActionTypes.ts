import type { TalksMap } from '../../../core/models'

export const GET_TALK_SUCCESS = 'talk/get/success'
export const GET_TALK_ERROR = 'talk/get/error'
export const SET_SELECTED_TALK = 'talk/setSelected'

/** Handled by the core talks reducer: merges the talk into the talk list. */
export type GetTalkSuccessAction = {
    type: typeof GET_TALK_SUCCESS
    payload: TalksMap
}

export type TalkAction =
    | GetTalkSuccessAction
    | { type: typeof GET_TALK_ERROR; payload: string }
    | { type: typeof SET_SELECTED_TALK; payload: string }
