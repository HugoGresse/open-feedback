import type { Speaker, SpeakersMap } from '../models'

export const GET_SPEAKER_SUCCESS = 'speaker/get/success'
export const GET_SPEAKER_ERROR = 'speaker/get/error'
export const GET_SPEAKERS_SUCCESS = 'speakers/get/success'
export const GET_SPEAKERS_ERROR = 'speakers/get/error'

export const FILTER_SPEAKER = 'speakers/filter'

export const ADD_SPEAKER_SUCCESS = 'speaker/add/success'
export const ADD_SPEAKER_ERROR = 'speaker/add/error'
export const EDIT_SPEAKER_SUCCESS = 'speaker/edit/success'
export const EDIT_SPEAKER_ERROR = 'speaker/edit/error'
export const REMOVE_SPEAKER_SUCCESS = 'speaker/remove/success'
export const REMOVE_SPEAKER_ERROR = 'speaker/remove/error'

export type SpeakersAction =
    | { type: typeof GET_SPEAKER_SUCCESS; payload: SpeakersMap }
    | { type: typeof GET_SPEAKER_ERROR; payload: unknown }
    | { type: typeof GET_SPEAKERS_SUCCESS; payload: SpeakersMap }
    | { type: typeof GET_SPEAKERS_ERROR; payload: unknown }
    | { type: typeof FILTER_SPEAKER; payload: string }
    | { type: typeof ADD_SPEAKER_SUCCESS; payload: Speaker }
    | { type: typeof EDIT_SPEAKER_SUCCESS; payload: Speaker }
    | { type: typeof REMOVE_SPEAKER_SUCCESS; payload: Speaker }
    | { type: typeof ADD_SPEAKER_ERROR; payload: { error: unknown } }
    | { type: typeof EDIT_SPEAKER_ERROR; payload: { error: unknown } }
    | { type: typeof REMOVE_SPEAKER_ERROR; payload: { error: unknown } }
