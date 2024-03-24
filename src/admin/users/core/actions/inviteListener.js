import { fireStoreMainInstance } from '../../../../firebase'
import { USER_INVITE_GET_SUCCESS } from '../usersActionTypes'
import { redirectToProject } from '../../../project/utils/redirectToProject'
import { addNotification } from '../../../notification/notifcationActions'
import { redirectToOrganization } from '../../../organization/utils/redirectToOrganization'

let stopListenForInvite
export const listenForInvite = (inviteId, navigate) => (dispatch) => {
    stopListenForInvite = fireStoreMainInstance
        .collection('invites')
        .doc(inviteId)
        .onSnapshot(
            (snapshot) => {
                if (snapshot.exists) {
                    const data = snapshot.data()
                    dispatch({
                        type: USER_INVITE_GET_SUCCESS,
                        payload: data,
                    })
                    if (data.status === 'completed') {
                        onInviteCompleted(data, navigate)
                    }
                } else {
                    dispatch(
                        addNotification({
                            type: 'error',
                            i18nkey: 'users.invitationGetFail',
                        })
                    )
                }
            },
            (error) => {
                // eslint-disable-next-line no-console
                console.error(error)
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'users.invitationGetFail',
                    })
                )
                return false
            }
        )
}

export const unsubscribeRealtimeInviteListener = () => () => {
    stopListenForInvite && stopListenForInvite()
}

const onInviteCompleted = (invite, navigate) => {
    if (invite.projectId) {
        redirectToProject(null, invite.projectId, navigate)
    } else if (invite.organizationId) {
        redirectToOrganization(invite.organizationId, navigate)
    } else {
        throw new Error('Unmanaged invite type on completion')
    }
}
