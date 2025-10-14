import {
    ADD_VOTEITEM,
    DELETE_ALL_VOTEITEMS,
    DELETE_VOTEITEM,
    EDIT_VOTEITEM,
    GET_VOTEITEMS_SUCCESS,
    REORDER_VOTEITEMS,
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

        case REORDER_VOTEITEMS: {
            const { activeId, overId } = payload
            const voteItems = [...state.voteItems]

            const activeIndex = voteItems.findIndex(
                (item) => item.id === activeId
            )
            const overIndex = voteItems.findIndex((item) => item.id === overId)

            if (
                activeIndex !== -1 &&
                overIndex !== -1 &&
                activeIndex !== overIndex
            ) {
                // Move the item from activeIndex to overIndex
                const [movedItem] = voteItems.splice(activeIndex, 1)
                voteItems.splice(overIndex, 0, movedItem)

                // Update positions based on new order
                const reorderedItems = voteItems.map((item, index) => ({
                    ...item,
                    position: index,
                }))

                return {
                    ...state,
                    voteItems: reorderedItems,
                }
            }

            return state
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
