import type { NavigateFunction } from 'react-router-dom'
import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import {
    type InviteDocument,
    USER_INVITE_GET_ERROR,
    USER_INVITE_GET_SUCCESS,
    USER_INVITE_LISTEN,
} from '../usersActionTypes'
import { redirectToProject } from '../../../project/utils/redirectToProject'
import { redirectToOrganization } from '../../../organization/utils/redirectToOrganization'

let stopListenForInvite: (() => void) | undefined
export const listenForInvite =
    (inviteId: string, navigate: NavigateFunction): AppThunk =>
    (dispatch) => {
        dispatch({ type: USER_INVITE_LISTEN })
        const onError = (error: unknown) => {
            // biome-ignore lint/suspicious/noConsole: intentional log
            console.error(error)
            dispatch({
                type: USER_INVITE_GET_ERROR,
                payload: isPermissionDenied(error) ? 'notAllowed' : 'failed',
            })
        }
        try {
            stopListenForInvite = fireStoreMainInstance
                .collection('invites')
                .doc(inviteId)
                .onSnapshot((snapshot) => {
                    if (snapshot.exists) {
                        const data = snapshot.data() as InviteDocument
                        dispatch({
                            type: USER_INVITE_GET_SUCCESS,
                            payload: data,
                        })
                        if (data.status === 'completed') {
                            onInviteCompleted(data, navigate)
                        }
                    } else if (!snapshot.metadata.fromCache) {
                        // Offline, the empty cache is not an answer: wait for
                        // the server.
                        dispatch({
                            type: USER_INVITE_GET_ERROR,
                            payload: 'failed',
                        })
                    }
                }, onError)
        } catch (error) {
            // An id from a mangled link, e.g. with a "/", is not a valid doc
            onError(error)
        }
    }

const isPermissionDenied = (error: unknown) =>
    (error as { code?: string } | null)?.code === 'permission-denied'

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
