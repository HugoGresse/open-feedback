import {
    ADD_VOTEITEM,
    DELETE_VOTEITEM,
    EDIT_VOTEITEM,
    GET_VOTEITEMS_ERROR,
    GET_VOTEITEMS_SUCCESS,
    MOVE_DOWN_VOTEITEM,
    MOVE_UP_VOTEITEM,
    SAVE_VOTEITEMS_ERROR,
    SAVE_VOTEITEMS_ONGOING,
    SAVE_VOTEITEMS_SUCCESS
} from './votingFormActionTypes'
import { fireStoreMainInstance } from '../../../../firebase'
import { getSelectedProjectIdSelector } from '../../core/projectSelectors'
import { ADD_NOTIFICATION } from '../../../notification/notificationActionTypes'
import {
    getBooleanVoteItemsSelector,
    getCommentVoteItemSelector,
    getVoteItemsSelector
} from './votingFormSelectors'

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

export const toggleVoteComment = enableComment => {
    return (dispatch, getState) => {
        if (enableComment) {
            return dispatch({
                type: ADD_VOTEITEM,
                payload: {
                    id: Date.now(),
                    name: 'Comment',
                    type: 'text'
                }
            })
        } else {
            return dispatch({
                type: DELETE_VOTEITEM,
                payload: getCommentVoteItemSelector(getState())
            })
        }
    }
}

// This method is probably way too complicated and the voteItems should have probably be better in a plain object field
// rather than in a collection...
export const saveVoteItems = () => {
    return (dispatch, getState) => {
        const voteItems = getVoteItemsSelector(getState())
        const selectedProjectId = getSelectedProjectIdSelector(getState())

        const localIds = voteItems.map(voteItem => voteItem.id)

        dispatch({
            type: SAVE_VOTEITEMS_ONGOING
        })

        return fireStoreMainInstance
            .collection('projects')
            .doc(selectedProjectId)
            .collection('voteItems')
            .get()
            .then(snapshot => {
                const voteItems = []
                snapshot.forEach(doc => {
                    voteItems.push(doc.id)
                })

                return voteItems
            })
            .then(remoteDocIds => {
                // 1. Filter remote ids by local ids and delete remote id not exsiting in local
                const idsToDelete = remoteDocIds.filter(
                    id => !localIds.includes(id)
                )

                // 2. For existing ids in local & remote, set them (erase the inside by the new value)
                const idsToSet = remoteDocIds.filter(id =>
                    localIds.includes(id)
                )

                // 3. Add new ids
                const idsToAdd = localIds.filter(
                    id => !remoteDocIds.includes(id)
                )

                return { idsToDelete, idsToSet, idsToAdd }
            })
            .then(({ idsToDelete, idsToSet, idsToAdd }) => {
                // Get a new write batch
                const batch = fireStoreMainInstance.batch()

                idsToDelete.forEach(id =>
                    batch.delete(
                        fireStoreMainInstance
                            .collection('projects')
                            .doc(selectedProjectId)
                            .collection('voteItems')
                            .doc(id)
                    )
                )

                voteItems
                    .filter(item => idsToSet.includes(item.id))
                    .forEach(item =>
                        batch.set(
                            fireStoreMainInstance
                                .collection('projects')
                                .doc(selectedProjectId)
                                .collection('voteItems')
                                .doc(item.id),
                            item
                        )
                    )

                voteItems
                    .filter(item => idsToAdd.includes(item.id))
                    .map(item => {
                        const copy = Object.assign({}, item)
                        delete copy.id
                        return copy
                    })
                    .forEach(item => {
                        batch.set(
                            fireStoreMainInstance
                                .collection('projects')
                                .doc(selectedProjectId)
                                .collection('voteItems')
                                .doc(),
                            item
                        )
                    })

                return batch.commit()
            })
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

                dispatch(getVoteItems())
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
