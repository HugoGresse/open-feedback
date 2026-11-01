import type { NavigateFunction } from 'react-router-dom'
import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import {
    type InviteDocument,
    USER_INVITE_GET_ERROR,
    USER_INVITE_GET_SUCCESS,
    USER_INVITE_LISTEN,
} from '../usersActionTypes'
import {
    getInviteDestination,
    getInviteDestinationUrl,
} from '../getInviteDialogStatus'

let stopListenForInvite: (() => void) | undefined
export const listenForInvite =
    (inviteId: string, navigate: NavigateFunction): AppThunk =>
    (dispatch) => {
        dispatch({ type: USER_INVITE_LISTEN })
        // The completed invite may be delivered again (e.g. back online): do
        // not take the user back to the joined event.
        let redirected = false
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
                        if (data.status === 'completed' && !redirected) {
                            redirected = true
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

/**
 * Opens the joined event. The organization is opened from the dialog, as its
 * modal would cover it.
 */
const onInviteCompleted = (
    invite: InviteDocument,
    navigate: NavigateFunction
) => {
    const destination = getInviteDestination(invite)
    if (destination?.type === 'project') {
        // Absolute, as the dialog may be open on any page, and replacing the
        // invite link so that going back does not redirect again.
        navigate(getInviteDestinationUrl(destination), { replace: true })
    }
}
