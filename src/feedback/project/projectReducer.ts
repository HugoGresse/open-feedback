import type firebase from 'firebase/compat/app'
import {
    GET_PROJECT_ERROR,
    GET_PROJECT_NOTFOUND,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_VOTE_RESULT_ERROR,
    GET_PROJECT_VOTE_RESULT_SUCCESS,
    INCREMENT_VOTE_LOCALLY,
    type ProjectAction,
    SET_SELECTED_DATE,
} from './projectActionTypes'
import { nowTimestamp } from '../../firebase.ts'
import {
    ADD_VOTE_SUCCESS,
    type AddVoteSuccessAction,
} from '../vote/voteActionTypes'
import type {
    AggregatedTextVotes,
    AggregatedVoteItemValue,
    Project,
    ProjectTalkVotes,
    TalkVotes,
} from '../../core/models'

/** Placeholder held until the project is loaded (`id` is null). */
export interface UnloadedProject {
    id: null
    contact: null
    favicon: null
    firebaseConfig: null
    logoSmall: null
    name: null
    voteItems: null
    chipColors: string[]
}

export interface ProjectState {
    project: Project | UnloadedProject
    talkVotes: ProjectTalkVotes | null
    selectedDate: string
    projectLoadError: string | null
    projectLoadNotFound?: boolean
    projectVotesError: firebase.firestore.FirestoreError | null
}

const initState: ProjectState = {
    project: {
        id: null,
        contact: null,
        favicon: null,
        firebaseConfig: null,
        logoSmall: null,
        name: null,
        voteItems: null,
        chipColors: [],
    },
    talkVotes: null,
    selectedDate: '',
    projectLoadError: null,
    projectVotesError: null,
}

/** The text votes of a vote item, `{}` when it holds none (or a counter). */
const asTextVotes = (value: TalkVotes[string]): AggregatedTextVotes =>
    typeof value === 'object' && value !== null ? value : {}

export const projectReducer = (
    state: ProjectState = initState,
    action: ProjectAction | AddVoteSuccessAction
): ProjectState => {
    switch (action.type) {
        case GET_PROJECT_SUCCESS:
            return {
                ...state,
                project: {
                    ...action.payload,
                },
            }

        case GET_PROJECT_VOTE_RESULT_SUCCESS:
            return {
                ...state,
                talkVotes: {
                    ...state.talkVotes,
                    [action.payload.id]: action.payload,
                },
            }
        case ADD_VOTE_SUCCESS: {
            // Only useful for Text votes
            return {
                ...state,
            }
        }
        case INCREMENT_VOTE_LOCALLY: {
            const { vote, amount } = action.payload

            // undefined when the talk has no votes loaded yet
            const precedentData =
                state.talkVotes?.[vote.talkId]?.[vote.voteItemId]

            let newVoteValue: AggregatedVoteItemValue
            if (vote.text) {
                const precedentTextVotes = asTextVotes(precedentData)
                if (amount === -1) {
                    if (vote.plus) {
                        // If the user remove his vote on another user text vote
                        newVoteValue = {
                            ...precedentTextVotes,
                            [vote.id]: {
                                ...precedentTextVotes[vote.id],
                                // A missing count gives NaN, as before typing
                                plus:
                                    (precedentTextVotes[vote.id].plus ?? NaN) -
                                    1,
                                updatedAt: nowTimestamp(),
                            },
                        }
                    } else {
                        // Remove a vote from the aggregate locally before database update
                        newVoteValue = {
                            ...precedentTextVotes,
                        }
                        delete newVoteValue[vote.id]
                    }
                } else if (vote.plus) {
                    newVoteValue = {
                        ...precedentTextVotes,
                        [vote.id]: {
                            ...precedentTextVotes[vote.id],
                            plus: (precedentTextVotes[vote.id].plus || 1) + 1,
                            updatedAt: nowTimestamp(),
                        },
                    }
                } else {
                    // An edit keeps the up-votes and date of the text vote,
                    // like the aggregation trigger does
                    const precedentTextVote = precedentTextVotes[vote.id]
                    newVoteValue = {
                        ...precedentTextVotes,
                        [vote.id]: {
                            ...vote,
                            plus: precedentTextVote?.plus ?? 1,
                            text: vote.text,
                            updatedAt: nowTimestamp(),
                            createdAt:
                                precedentTextVote?.createdAt ?? nowTimestamp(),
                        },
                    }
                }
            } else {
                const precedentCount =
                    typeof precedentData === 'number' ? precedentData : 0
                // A missing amount gives NaN, as before typing
                newVoteValue = precedentCount + (amount ?? NaN)
            }

            if (!state.talkVotes || !state.talkVotes[vote.talkId]) {
                return {
                    ...state,
                    talkVotes: {
                        ...state.talkVotes,
                        [vote.talkId]: {
                            [vote.voteItemId]: newVoteValue,
                        },
                    },
                }
            }

            return {
                ...state,
                talkVotes: {
                    ...state.talkVotes,
                    [vote.talkId]: {
                        ...state.talkVotes[vote.talkId],
                        [vote.voteItemId]: newVoteValue,
                    },
                },
            }
        }
        case GET_PROJECT_VOTE_RESULT_ERROR:
            // eslint-disable-next-line no-console
            console.error(action.payload)
            return {
                ...state,
                projectVotesError: action.payload,
            }
        case GET_PROJECT_NOTFOUND:
            return {
                ...state,
                projectLoadNotFound: true,
            }
        case GET_PROJECT_ERROR:
            // eslint-disable-next-line no-console
            console.error(action.payload)
            return {
                ...state,
                projectLoadError: action.payload,
            }

        case SET_SELECTED_DATE:
            return {
                ...state,
                selectedDate: action.payload.date,
            }
        default:
            return state
    }
}
