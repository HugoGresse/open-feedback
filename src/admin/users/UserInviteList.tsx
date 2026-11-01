import { useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import {
    cancelInvite,
    hideInvite,
    listenForInvites,
} from './core/actions/usersActions'
import { getListedInvitesSelector } from './core/usersSelectors'
import { UserInviteItem } from './UserInviteItem.tsx'
import { TranslatedTypography } from '../baseComponents/TranslatedTypography.tsx'
import { useAppDispatch, useAppSelector } from '../../store'
import { getSelectedProjectIdSelector } from '../project/core/projectSelectors'
import { getSelectedOrganizationIdSelector } from '../organization/core/organizationSelectors'

export const UserInviteList = () => {
    const dispatch = useAppDispatch()
    const invites = useAppSelector(getListedInvitesSelector)
    const projectId = useAppSelector(getSelectedProjectIdSelector)
    const organizationId = useAppSelector(getSelectedOrganizationIdSelector)

    useEffect(
        () => dispatch(listenForInvites(projectId, organizationId)),
        [dispatch, projectId, organizationId]
    )

    const onAcceptedShown = useCallback(
        (inviteId: string) => dispatch(hideInvite(inviteId)),
        [dispatch]
    )

    if (invites.length === 0) {
        return ''
    }

    return (
        <Box>
            <TranslatedTypography
                variant="h6"
                style={{ marginTop: 20, marginLeft: 32, marginBottom: 10 }}
                i18nKey="users.invites"
            >
                PENDING INVITES
            </TranslatedTypography>
            {invites.map((invite) => (
                <UserInviteItem
                    key={invite.id}
                    invite={invite}
                    cancelInvite={(inviteId) =>
                        dispatch(cancelInvite(inviteId))
                    }
                    onAcceptedShown={onAcceptedShown}
                />
            ))}
        </Box>
    )
}
