import {
    ADD_VOTEITEM,
    DELETE_VOTEITEM,
    EDIT_VOTEITEM,
    GET_VOTEITEMS_ERROR,
    GET_VOTEITEMS_SUCCESS,
    MOVE_DOWN_VOTEITEM,
    MOVE_UP_VOTEITEM
} from './votingFormActionTypes'

const initState = {
    voteItems: []
}

const votingFormReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_VOTEITEMS_SUCCESS:
            return {
                ...state,
                voteItems: payload
            }
        case EDIT_VOTEITEM: {
            const voteItems = state.voteItems.map(item => {
                if (item.id === payload.id) {
                    return payload
                }
                return item
            })

            return {
                ...state,
                voteItems: voteItems
            }
        }

        case MOVE_UP_VOTEITEM: {
            const newPosition = payload.position > 1 ? payload.position - 1 : 0

            const voteItems = state.voteItems.map(item => {
                if (item.id === payload.id) {
                    return {
                        ...item,
                        position: newPosition
                    }
                } else if (item.position === newPosition) {
                    return {
                        ...item,
                        position: item.position + 1
                    }
                }
                return item
            })

            return {
                ...state,
                voteItems: voteItems
            }
        }

        case MOVE_DOWN_VOTEITEM: {
            const newPosition = payload.position + 1

            const voteItems = state.voteItems.map(item => {
                if (item.id === payload.id) {
                    return {
                        ...item,
                        position: newPosition
                    }
                } else if (item.position === newPosition) {
                    return {
                        ...item,
                        position: item.position - 1
                    }
                }
                return item
            })

            return {
                ...state,
                voteItems: voteItems
            }
        }
        case DELETE_VOTEITEM: {
            const indexToRemove = state.voteItems.findIndex(
                item => item.id === payload.id
            )
            const voteItems = [
                ...state.voteItems.slice(0, indexToRemove),
                ...state.voteItems.slice(indexToRemove + 1)
            ]

            return {
                ...state,
                voteItems: voteItems
            }
        }
        case ADD_VOTEITEM: {
            return {
                ...state,
                voteItems: [...state.voteItems, payload]
            }
        }
        case GET_VOTEITEMS_ERROR:
        default:
            return state
    }
}

export default votingFormReducer
