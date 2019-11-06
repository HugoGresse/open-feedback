import {
    ADD_VOTEITEM,
    DELETE_VOTEITEM,
    EDIT_VOTEITEM,
    GET_VOTEITEMS_SUCCESS,
    MOVE_DOWN_VOTEITEM,
    MOVE_UP_VOTEITEM,
    SAVE_VOTEITEMS_ERROR,
    SAVE_VOTEITEMS_ONGOING,
    SAVE_VOTEITEMS_SUCCESS
} from './votingFormActionTypes'
import {fireStoreMainInstance} from '../../../../firebase'
import {getSelectedProjectIdSelector, getSelectedProjectSelector} from '../../core/projectSelectors'
import {ADD_NOTIFICATION} from '../../../notification/notificationActionTypes'
import {
    getBooleanVoteItemsSelector,
    getCommentVoteItemSelector,
    getVoteItemsSelector
} from './votingFormSelectors'
import {newId} from '../../../../utils/stringUtils'

export const getVoteItems = () => (dispatch, getState) => dispatch({
    type: GET_VOTEITEMS_SUCCESS,
    payload: getSelectedProjectSelector(getState()).voteItems || []
})

export const onVoteItemChange = voteItem => ({
    type: EDIT_VOTEITEM,
    payload: voteItem
})

export const onVoteItemMoveUp = voteItem => ({
    type: MOVE_UP_VOTEITEM,
    payload: voteItem
})

export const onVoteItemMoveDown = voteItem => ({
    type: MOVE_DOWN_VOTEITEM,
    payload: voteItem
})

export const onVoteItemDelete = voteItem => ({
    type: DELETE_VOTEITEM,
    payload: voteItem
})

export const onVoteItemAddBoolean = () => {
    return (dispatch, getState) => {
        const voteItems = getBooleanVoteItemsSelector(getState())
        const position =
            voteItems.length > 0 ? voteItems.slice(-1)[0].position + 1 : 0

        return dispatch({
            type: ADD_VOTEITEM,
            payload: {
                id: newId(),
                name: '',
                position: position,
                type: 'boolean'
            }
        })
    }
}

export const toggleVoteComment = enableComment => {
    return (dispatch, getState) => {
        if (enableComment) {
            dispatch({
                type: ADD_VOTEITEM,
                payload: {
                    id: newId(),
                    name: 'Comment',
                    type: 'text'
                }
            })
        } else {
            dispatch({
                type: DELETE_VOTEITEM,
                payload: getCommentVoteItemSelector(getState())
            })
        }

        return dispatch(saveVoteItems())
    }
}

// This method is probably way too complicated and the voteItems should have probably be better in a plain object field
// rather than in a collection...
export const saveVoteItems = () => {
    return (dispatch, getState) => {
        const voteItems = getVoteItemsSelector(getState())
        const selectedProjectId = getSelectedProjectIdSelector(getState())

        dispatch({
            type: SAVE_VOTEITEMS_ONGOING
        })


        return fireStoreMainInstance
            .collection('projects')
            .doc(selectedProjectId)
            .set({
                voteItems
            }, {merge: true})
            .then(() => {
                dispatch({
                    type: ADD_NOTIFICATION,
                    payload: {
                        type: 'success',
                        message: 'Voting form saved'
                    }
                })

                dispatch({
                    type: SAVE_VOTEITEMS_SUCCESS
                })
            })
            .catch(error => {
                console.error(error)
                dispatch({
                    type: SAVE_VOTEITEMS_ERROR,
                    payload: error
                })

                dispatch({
                    type: ADD_NOTIFICATION,
                    payload: {
                        type: 'error',
                        message: 'Saving failed, ' + JSON.stringify(error)
                    }
                })
            })
    }
}
