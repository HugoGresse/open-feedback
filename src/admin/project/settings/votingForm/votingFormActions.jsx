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
import { fireStoreMainInstance, serverTimestamp } from '../../../../firebase.ts'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../../core/projectSelectors'
import {
    getVoteItemsSelector,
    isSavingVotingFormSelector,
} from './votingFormSelectors'
import { newId } from '../../../../utils/stringUtils'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_SEPARATOR, VOTE_TYPE_TEXT } from '../../../../core/contants'
import { filterMap } from '../../../../utils/mapUtils'
import { addNotification } from '../../../notification/notifcationActions'
import {
    getSelectedOrganizationIdSelector,
    getSelectedOrganizationSelector,
} from '../../../organization/core/organizationSelectors'

export const getVoteItems = () => (dispatch, getState) => {
    const state = getState()

    const selectedProjectId = getSelectedProjectIdSelector(state)
    const selectedOrganizationId = getSelectedOrganizationIdSelector(state)

    let voteItems = selectedProjectId
        ? getSelectedProjectSelector(state).voteItems
        : selectedOrganizationId
        ? getSelectedOrganizationSelector(state).voteItems
        : []

    dispatch({
        type: GET_VOTEITEMS_SUCCESS,
        payload: voteItems,
    })
}

export const onVoteItemChange = (voteItem) => (dispatch, getState) => {
    const savedVoteItem = getVoteItemsSelector(getState()).filter(
        (item) => voteItem.id === item.id
    )[0]

    const editedVoteItem = {
        ...voteItem,
    }

    if (!editedVoteItem.local && editedVoteItem.type !== savedVoteItem.type) {
        editedVoteItem.oldId = editedVoteItem.id
        editedVoteItem.id = newId()
    }

    if (editedVoteItem.type === VOTE_TYPE_SEPARATOR) {
        editedVoteItem.name = null
        editedVoteItem.languages = {}
    }

    dispatch({
        type: EDIT_VOTEITEM,
        payload: editedVoteItem,
    })
}

export const onVoteItemMoveUp = (voteItem) => ({
    type: MOVE_UP_VOTEITEM,
    payload: voteItem,
})

export const onVoteItemMoveDown = (voteItem) => ({
    type: MOVE_DOWN_VOTEITEM,
    payload: voteItem,
})

export const onVoteItemDelete = (voteItem) => ({
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

export const saveVoteItems = (hideNotification) => (dispatch, getState) => {
    const state = getState()
    const isSaving = isSavingVotingFormSelector(state)
    const voteItems = getVoteItemsSelector(state)
    const selectedProjectId = getSelectedProjectIdSelector(state)
    const selectedOrganizationId = getSelectedOrganizationIdSelector(state)

    const collectionName = selectedProjectId ? 'projects' : 'organizations'
    const documentId = selectedProjectId || selectedOrganizationId

    if (isSaving) {
        return
    }

    let tempLanguages = {}
    const cleanedVoteItems = voteItems
        .filter((item) => {
            if (item.type === VOTE_TYPE_SEPARATOR) {
                return true
            }
            return item.name
        })
        .map((item) => {
            delete item.local

            if (!item.languages) return item

            tempLanguages = filterMap(
                item.languages,
                (translatedName) => translatedName
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
        .collection(collectionName)
        .doc(documentId)
        .set(
            {
                voteItems: cleanedVoteItems,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        )
        .then(() => {
            if (!hideNotification) {
                dispatch(
                    addNotification({
                        type: 'success',
                        i18nkey: 'settingsVotingForm.saveSuccess',
                    })
                )
            }

            dispatch({
                type: SAVE_VOTEITEMS_SUCCESS,
                payload: cleanedVoteItems,
            })
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
            dispatch({
                type: SAVE_VOTEITEMS_ERROR,
                payload: error,
            })

            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'settingsVotingForm.saveFail',
                    message: JSON.stringify(error),
                })
            )
        })
}

export const deleteAllVoteItems = () => async (dispatch) => {
    dispatch({
        type: DELETE_ALL_VOTEITEMS,
    })
}

export const fillDefaultVotingForm = (t, replace) => async (dispatch) => {
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
