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
} from './votingFormActionTypes'
import { fireStoreMainInstance, serverTimestamp } from '../../../../firebase'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../../core/projectSelectors'
import { ADD_NOTIFICATION } from '../../../notification/notificationActionTypes'
import { getVoteItemsSelector } from './votingFormSelectors'
import { newId } from '../../../../utils/stringUtils'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../../../core/contants'
import { filterMap } from '../../../../utils/mapUtils'

export const getVoteItems = () => (dispatch, getState) =>
    dispatch({
        type: GET_VOTEITEMS_SUCCESS,
        payload: getSelectedProjectSelector(getState())
            ? getSelectedProjectSelector(getState()).voteItems
            : [],
    })

export const onVoteItemChange = voteItem => (dispatch, getState) => {
    const savedVoteItem = getVoteItemsSelector(getState()).filter(
        item => voteItem.id === item.id
    )[0]

    const editedVoteItem = {
        ...voteItem,
    }

    if (!editedVoteItem.local && editedVoteItem.type !== savedVoteItem.type) {
        editedVoteItem.oldId = editedVoteItem.id
        editedVoteItem.id = newId()
    }

    dispatch({
        type: EDIT_VOTEITEM,
        payload: editedVoteItem,
    })
}

export const onVoteItemMoveUp = voteItem => ({
    type: MOVE_UP_VOTEITEM,
    payload: voteItem,
})

export const onVoteItemMoveDown = voteItem => ({
    type: MOVE_DOWN_VOTEITEM,
    payload: voteItem,
})

export const onVoteItemDelete = voteItem => ({
    type: DELETE_VOTEITEM,
    payload: voteItem,
})

export const onVoteItemSaveConfirmed = () => ({
    type: SAVE_VOTEITEM_CONFIRM,
})

export const addVoteItem = (optionalName, type) => {
    return (dispatch, getState) => {
        const voteItems = getVoteItemsSelector(getState())
        let position = 0
        if (voteItems.length > 0) {
            if (voteItems[voteItems.length - 1].position >= 0) {
                position = voteItems[voteItems.length - 1].position + 1
            } else {
                position = voteItems.length
            }
        }

        return dispatch({
            type: ADD_VOTEITEM,
            payload: {
                id: newId(),
                name: optionalName || '',
                position: position,
                type: type,
                local: true,
            },
        })
    }
}

export const saveVoteItems = () => {
    return (dispatch, getState) => {
        const voteItems = getVoteItemsSelector(getState())
        const selectedProjectId = getSelectedProjectIdSelector(getState())

        let tempLanguages = {}
        const cleanedVoteItems = voteItems
            .filter(item => item.name)
            .map(item => {
                delete item.local

                if (!item.languages) return item

                tempLanguages = filterMap(
                    item.languages,
                    translatedName => translatedName
                )

                if (Object.keys(tempLanguages).length === 0) {
                    delete item.languages
                    return item
                }

                return {
                    ...item,
                    languages: tempLanguages,
                }
            })

        dispatch({
            type: SAVE_VOTEITEMS_ONGOING,
        })

        return fireStoreMainInstance
            .collection('projects')
            .doc(selectedProjectId)
            .set(
                {
                    voteItems: cleanedVoteItems,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            )
            .then(() => {
                dispatch({
                    type: ADD_NOTIFICATION,
                    payload: {
                        type: 'success',
                        message: 'Voting form saved',
                    },
                })

                dispatch({
                    type: SAVE_VOTEITEMS_SUCCESS,
                    payload: cleanedVoteItems,
                })
            })
            .catch(error => {
                console.error(error)
                dispatch({
                    type: SAVE_VOTEITEMS_ERROR,
                    payload: error,
                })

                dispatch({
                    type: ADD_NOTIFICATION,
                    payload: {
                        type: 'error',
                        message: 'Saving failed, ' + JSON.stringify(error),
                    },
                })
            })
    }
}

export const deleteAllVoteItems = () => async dispatch => {
    dispatch({
        type: DELETE_ALL_VOTEITEMS,
    })
}

export const fillDefaultVotingForm = (t, replace) => async dispatch => {
    if (replace) {
        await dispatch(deleteAllVoteItems())
    }
    await dispatch(addVoteItem(t('defaultVotingForm.fun'), VOTE_TYPE_BOOLEAN))
    await dispatch(
        addVoteItem(t('defaultVotingForm.learned'), VOTE_TYPE_BOOLEAN)
    )
    await dispatch(
        addVoteItem(t('defaultVotingForm.interesting'), VOTE_TYPE_BOOLEAN)
    )
    await dispatch(
        addVoteItem(t('defaultVotingForm.speaker'), VOTE_TYPE_BOOLEAN)
    )
    await dispatch(
        addVoteItem(t('defaultVotingForm.nclear'), VOTE_TYPE_BOOLEAN)
    )
    await dispatch(
        addVoteItem(t('defaultVotingForm.technical'), VOTE_TYPE_BOOLEAN)
    )
    await dispatch(
        addVoteItem(t('defaultVotingForm.example'), VOTE_TYPE_BOOLEAN)
    )
    await dispatch(
        addVoteItem(t('defaultVotingForm.complex'), VOTE_TYPE_BOOLEAN)
    )
    await dispatch(addVoteItem(t('defaultVotingForm.comment'), VOTE_TYPE_TEXT))
}
