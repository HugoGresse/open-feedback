import { useEffect, useState } from 'react'
import type { User } from '../../core/models'
import RemoveButton from '@mui/icons-material/RemoveCircle'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import type { Theme } from '@mui/material/styles'
import {
    changeUserRole,
    getUserDetails,
    removeUser,
} from './core/actions/usersActions'
import { getFilteredUsersSelector } from './core/usersSelectors'
import { OFListItem } from '../baseComponents/layouts/OFListItem.tsx'
import Avatar from '@mui/material/Avatar'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { UserRoleSelect } from './components/UserRoleSelect.tsx'
import { ORGANIZATION_USER_ROLE_OWNER } from '../organization/core/organizationConstants'
import { SimpleDialog } from '../baseComponents/layouts/SimpleDialog.tsx'
import { TranslatedTypography } from '../baseComponents/TranslatedTypography.tsx'
import { useTranslation } from 'react-i18next'
import { OrganizationRoleInfo } from '../organization/users/OrganizationRoleInfos.tsx'
import { useAppDispatch, useAppSelector } from '../../store'

const useStyles = makeStyles((theme: Theme) => ({
    cell: {
        paddingRight: 12,
        [theme.breakpoints.down('xl')]: {
            paddingTop: 12,
        },
    },
    buttonCell: {
        textAlign: 'right',
    },
}))

export interface UserItemProps {
    userId: string
    ownerId: string
    currentUserId: string
    role: string
    /** Roles that can be picked, empty when the role cannot be changed. */
    userTypes: readonly string[]
}

export const UserItem = ({
    userId,
    ownerId,
    currentUserId,
    role,
    userTypes,
}: UserItemProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const usersDetails = useAppSelector(getFilteredUsersSelector)
    const dispatch = useAppDispatch()
    const [confirmOwnerChange, setConfirmOwnerChange] = useState(false)

    const user: User | undefined = usersDetails[userId]

    const isOwner = userId === ownerId
    const isMe = currentUserId === userId

    useEffect(() => {
        dispatch(getUserDetails(userId))
    }, [dispatch, userId])

    const onUserRoleValueChange = (
        userId: string,
        oldRole: string,
        newRole: string
    ) => {
        if (oldRole === newRole) {
            return
        }
        if (newRole === ORGANIZATION_USER_ROLE_OWNER) {
            setConfirmOwnerChange(true)
        } else {
            dispatch(changeUserRole(userId, role, newRole))
        }
    }

    if (!user) {
        return ''
    }

    return (
        <OFListItem>
            <Grid item xs={12} sm={7} className={classes.cell}>
                <Box display="flex">
                    <Avatar
                        alt={user.displayName ?? undefined}
                        src={user.photoURL ?? undefined}
                        style={{ marginRight: 12, marginTop: 2 }}
                    />
                    <Box>
                        <Typography>{user.displayName}</Typography>
                        <Typography style={{ color: '#999' }}>
                            {user.email}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.cell}>
                <Box display="flex" alignItems="center">
                    <UserRoleSelect
                        disabled={isMe || isOwner}
                        selectedUserRole={role}
                        userTypes={userTypes}
                        onRoleChange={(newRole) =>
                            onUserRoleValueChange(userId, role, newRole)
                        }
                    />
                    {userTypes.length > 0 && <OrganizationRoleInfo />}
                </Box>
            </Grid>
            <Grid item xs={12} sm={2} className={classes.buttonCell}>
                {!isOwner && !isMe && (
                    <IconButton
                        aria-label="Remove the user from the event"
                        onClick={() => dispatch(removeUser(userId, role))}
                        size="large"
                    >
                        <RemoveButton />
                    </IconButton>
                )}
            </Grid>
            {confirmOwnerChange && (
                <SimpleDialog
                    onClose={() => setConfirmOwnerChange(false)}
                    onConfirm={() => {
                        setConfirmOwnerChange(false)
                        dispatch(
                            changeUserRole(
                                userId,
                                role,
                                ORGANIZATION_USER_ROLE_OWNER
                            )
                        )
                    }}
                    title={t('common.attention')}
                    cancelText={t('common.cancel')}
                    confirmText={t('organization.confirmOwnerButton')}
                    open={true}
                >
                    <TranslatedTypography i18nKey="organization.confirmOwner" />
                </SimpleDialog>
            )}
        </OFListItem>
    )
}
