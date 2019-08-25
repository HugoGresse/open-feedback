import {
    ADD_VOTEITEM,
    DELETE_VOTEITEM,
    EDIT_VOTEITEM,
    GET_VOTEITEMS_ERROR,
    GET_VOTEITEMS_SUCCESS,
    MOVE_DOWN_VOTEITEM,
    MOVE_UP_VOTEITEM
} from './votingFormActionTypes'
import { fireStoreMainInstance } from '../../../../firebase'
import { getSelectedProjectIdSelector } from '../../core/projectSelectors'
import { ADD_NOTIFICATION } from '../../../notification/notificationActionTypes'
import { getBooleanVoteItemsSelector } from './votingFormSelectors'

export const getVoteItems = () => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(getSelectedProjectIdSelector(getState()))
            .collection('voteItems')
            .get()
            .then(snapshot => {
                const voteItems = []
                snapshot.forEach(doc => {
                    voteItems.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })

                dispatch({
                    type: GET_VOTEITEMS_SUCCESS,
                    payload: voteItems
                })
            })
            .catch(err => {
                dispatch({
                    type: ADD_NOTIFICATION,
                    payload: {
                        type: 'error',
                        message:
                            'Failed to load Vote Items, err: ' + err.toString()
                    }
                })

                dispatch({
                    type: GET_VOTEITEMS_ERROR,
                    payload: err.toString()
                })
            })
    }
}

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
                id: Date.now(),
                name: '',
                position: position,
                type: 'boolean'
            }
        })
    }
}
