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
    type VotingFormAction,
} from './votingFormActionTypes.tsx'
import type { TFunction } from 'i18next'
import type { AppThunk } from '../../../../store'
import type { VoteItem, VoteItemType } from '../../../../core/models'
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
import {
    VOTE_TYPE_BOOLEAN,
    VOTE_TYPE_SEPARATOR,
    VOTE_TYPE_TEXT,
} from '../../../../core/contants'
import { filterMap } from '../../../../utils/mapUtils'
import { addNotification } from '../../../notification/notifcationActions'
import {
    getSelectedOrganizationIdSelector,
    getSelectedOrganizationSelector,
} from '../../../organization/core/organizationSelectors'

export const getVoteItems = (): AppThunk => (dispatch, getState) => {
    const state = getState()

    const selectedProjectId = getSelectedProjectIdSelector(state)
    const selectedOrganizationId = getSelectedOrganizationIdSelector(state)

    // Like the untyped code, this throws when the selected project or
    // organization is not loaded.
    const voteItems: VoteItem[] | undefined = selectedProjectId
        ? required(getSelectedProjectSelector(state)).voteItems
        : selectedOrganizationId
          ? required(getSelectedOrganizationSelector(state)).voteItems
          : []

    dispatch({
        type: GET_VOTEITEMS_SUCCESS,
        payload: voteItems,
    })
}

/**
 * Throws on a missing value, where the untyped code read a property of it (or
 * gave Firestore a null id) and threw.
 */
const required = <T,>(value: T | null | undefined): T => {
    if (!value) {
        throw new TypeError('Missing value')
    }
    return value
}

export const onVoteItemChange =
    (voteItem: VoteItem): AppThunk =>
    (dispatch, getState) => {
        const savedVoteItem = getVoteItemsSelector(getState()).find(
            (item) => voteItem.id === item.id
        )

        const editedVoteItem: VoteItem = {
            ...voteItem,
        }

        if (
            !editedVoteItem.local &&
            editedVoteItem.type !== required(savedVoteItem).type
        ) {
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

export const onVoteItemsReorder = (
    activeId: string,
    overId: string
): VotingFormAction => ({
    type: REORDER_VOTEITEMS,
    payload: { activeId, overId },
})

export const onVoteItemDelete = (voteItem: VoteItem): VotingFormAction => ({
    type: DELETE_VOTEITEM,
    payload: voteItem,
})

export const onVoteItemSaveConfirmed = (): VotingFormAction => ({
    type: SAVE_VOTEITEM_CONFIRM,
})

export const addVoteItem = (
    optionalName: string | undefined,
    type: VoteItemType
): AppThunk<VotingFormAction> => {
    return (dispatch, getState) => {
        const voteItems = getVoteItemsSelector(getState())
        let position = 0
        if (voteItems.length > 0) {
            const lastPosition = voteItems[voteItems.length - 1].position
            if (lastPosition !== undefined && lastPosition >= 0) {
                position = lastPosition + 1
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

export const saveVoteItems =
    (hideNotification?: boolean): AppThunk<Promise<void> | undefined> =>
    (dispatch, getState) => {
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

        let tempLanguages: Record<string, string> = {}
        const cleanedVoteItems: VoteItem[] = voteItems
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
            .doc(required(documentId))
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
            .catch((error: unknown) => {
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

export const deleteAllVoteItems =
    (): AppThunk<Promise<void>> => async (dispatch) => {
        dispatch({
            type: DELETE_ALL_VOTEITEMS,
        })
    }

export const fillDefaultVotingForm =
    (t: TFunction, replace?: boolean): AppThunk<Promise<void>> =>
    async (dispatch) => {
        if (replace) {
            await dispatch(deleteAllVoteItems())
        }
        await dispatch(
            addVoteItem(t('defaultVotingForm.fun'), VOTE_TYPE_BOOLEAN)
        )
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
        await dispatch(
            addVoteItem(t('defaultVotingForm.comment'), VOTE_TYPE_TEXT)
        )
    }
