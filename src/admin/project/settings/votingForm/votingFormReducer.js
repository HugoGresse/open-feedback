import {
    ADD_VOTEITEM,
    DELETE_ALL_VOTEITEMS,
    DELETE_VOTEITEM,
    EDIT_VOTEITEM,
    GET_VOTEITEMS_SUCCESS,
    MOVE_DOWN_VOTEITEM,
    MOVE_UP_VOTEITEM,
    SAVE_VOTEITEM_CONFIRM,
    SAVE_VOTEITEMS_ERROR,
    SAVE_VOTEITEMS_ONGOING,
    SAVE_VOTEITEMS_SUCCESS,
} from './votingFormActionTypes.jsx'
import { SELECT_PROJECT } from '../../core/projectActionTypes'

const initState = {
    voteItems: [],
    ongoingSave: false,
    shouldConfirmSave: false,
}

const votingFormReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case SELECT_PROJECT:
            // called on project switch
            return initState
        case GET_VOTEITEMS_SUCCESS:
            return {
                ...state,
                voteItems: payload || [],
            }
        case EDIT_VOTEITEM: {
            let shouldConfirm = state.shouldConfirmSave
            const voteItems = state.voteItems.map((item) => {
                if (item.id === payload.id) {
                    return payload
                }

                if (item.id === payload.oldId) {
                    // Type changed, new id has been generated
                    shouldConfirm = true
                    return payload
                }
                return item
            })

            return {
                ...state,
                voteItems: voteItems,
                shouldConfirmSave: shouldConfirm,
            }
        }

        case MOVE_UP_VOTEITEM: {
            const newPosition = payload.position > 1 ? payload.position - 1 : 0

            const voteItems = state.voteItems.map((item) => {
                if (item.id === payload.id) {
                    return {
                        ...item,
                        position: newPosition,
                    }
                } else if (item.position === newPosition) {
                    return {
                        ...item,
                        position: item.position + 1,
                    }
                }
                return item
            })

            return {
                ...state,
                voteItems: voteItems,
            }
        }

        case MOVE_DOWN_VOTEITEM: {
            const newPosition = payload.position + 1

            const voteItems = state.voteItems.map((item) => {
                if (item.id === payload.id) {
                    return {
                        ...item,
                        position: newPosition,
                    }
                } else if (item.position === newPosition) {
                    return {
                        ...item,
                        position: item.position - 1,
                    }
                }
                return item
            })

            return {
                ...state,
                voteItems: voteItems,
            }
        }
        case DELETE_VOTEITEM: {
            const indexToRemove = state.voteItems.findIndex(
                (item) => item.id === payload.id
            )
            const voteItems = [
                ...state.voteItems.slice(0, indexToRemove),
                ...state.voteItems.slice(indexToRemove + 1),
            ]

            return {
                ...state,
                voteItems: voteItems,
                shouldConfirmSave: state.shouldConfirmSave
                    ? true
                    : !payload.local,
            }
        }
        case DELETE_ALL_VOTEITEMS: {
            return {
                ...state,
                voteItems: [],
            }
        }
        case ADD_VOTEITEM: {
            return {
                ...state,
                voteItems: [...state.voteItems, payload],
            }
        }
        case SAVE_VOTEITEM_CONFIRM:
            return {
                ...state,
                shouldConfirmSave: false,
            }
        case SAVE_VOTEITEMS_SUCCESS:
            return {
                ...state,
                ongoingSave: false,
                voteItems: payload,
            }
        case SAVE_VOTEITEMS_ERROR:
            return {
                ...state,
                ongoingSave: false,
            }
        case SAVE_VOTEITEMS_ONGOING:
            return {
                ...state,
                ongoingSave: true,
            }
        default:
            return state
    }
}

export default votingFormReducer
