import { getAdminStateSelector } from '../../adminSelector'
import type { RootState } from '../../../store'
import type { AdminModerationState } from './moderationReducer'

const getModeration = (state: RootState): AdminModerationState =>
    getAdminStateSelector(state).adminModeration
const getModerationData = (state: RootState) => getModeration(state).data

export const getTextVotesSelector = (state: RootState) =>
    getModerationData(state).textVotes
export const isTextVotesLoadedSelector = (state: RootState) =>
    getModeration(state).textVotesLoaded
