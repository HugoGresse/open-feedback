import type { NavigateFunction } from 'react-router-dom'
import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import {
    type InviteDocument,
    USER_INVITE_GET_ERROR,
    USER_INVITE_GET_SUCCESS,
} from '../usersActionTypes'
import { redirectToProject } from '../../../project/utils/redirectToProject'
import { redirectToOrganization } from '../../../organization/utils/redirectToOrganization'

let stopListenForInvite: (() => void) | undefined
export const listenForInvite =
    (inviteId: string, navigate: NavigateFunction): AppThunk =>
    (dispatch) => {
        stopListenForInvite = fireStoreMainInstance
            .collection('invites')
            .doc(inviteId)
            .onSnapshot(
                (snapshot) => {
                    if (snapshot.exists) {
                        const data = snapshot.data() as InviteDocument
                        dispatch({
                            type: USER_INVITE_GET_SUCCESS,
                            payload: data,
                        })
                        if (data.status === 'completed') {
                            onInviteCompleted(data, navigate)
                        }
                    } else {
                        dispatch({
                            type: USER_INVITE_GET_ERROR,
                            payload: 'failed',
                        })
                    }
                },
                (error) => {
                    // An invite is only readable by the account it was sent
                    // to, the dialog explains it to the user.
                    if (error.code === 'permission-denied') {
                        dispatch({
                            type: USER_INVITE_GET_ERROR,
                            payload: 'notAllowed',
                        })
                        return
                    }
                    // biome-ignore lint/suspicious/noConsole: intentional log
                    console.error(error)
                    dispatch({ type: USER_INVITE_GET_ERROR, payload: 'failed' })
                }
            )
    }

export const unsubscribeRealtimeInviteListener = (): AppThunk => () => {
    stopListenForInvite?.()
}

const onInviteCompleted = (
    invite: InviteDocument,
    navigate: NavigateFunction
) => {
    if ('projectId' in invite && invite.projectId) {
        redirectToProject(null, invite.projectId, navigate)
    } else if ('organizationId' in invite && invite.organizationId) {
        redirectToOrganization(invite.organizationId, navigate)
    } else {
        throw new Error('Unmanaged invite type on completion')
    }
}
