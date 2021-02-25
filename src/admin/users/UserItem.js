import React, { useEffect, useState } from 'react'
import RemoveButton from '@material-ui/icons/RemoveCircle'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useDispatch, useSelector } from 'react-redux'
import {
    changeUserRole,
    getUserDetails,
    removeUser,
} from './core/actions/usersActions'
import { getFilteredUsersSelector } from './core/usersSelectors'
import OFListItem from '../baseComponents/layouts/OFListItem'
import Avatar from '@material-ui/core/Avatar'
import { Box } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { UserRoleSelect } from './components/UserRoleSelect'
import { ORGANIZATION_USER_ROLE_OWNER } from '../organization/core/organizationConstants'
import SimpleDialog from '../baseComponents/layouts/SimpleDialog'
import TranslatedTypography from '../baseComponents/TranslatedTypography'
import { useTranslation } from 'react-i18next'
import { OrganizationRoleInfo } from '../organization/users/OrganizationRoleInfos'

const useStyles = makeStyles((theme) => ({
    cell: {
        paddingRight: 12,
        [theme.breakpoints.down('sm')]: {
            paddingTop: 12,
        },
    },
    buttonCell: {
        textAlign: 'right',
    },
}))

const UserItem = ({ userId, ownerId, currentUserId, role, userTypes }) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const usersDetails = useSelector(getFilteredUsersSelector)
    const dispatch = useDispatch()
    const [confirmOwnerChange, setConfirmOwnerChange] = useState(false)

    const user = usersDetails[userId]

    const isOwner = userId === ownerId
    const isMe = currentUserId === userId

    useEffect(() => {
        dispatch(getUserDetails(userId))
    }, [dispatch, userId])

    const onUserRoleValueChange = (userId, oldRole, newRole) => {
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
            <Grid item xs={12} sm={6} className={classes.cell}>
                <Box display="flex">
                    <Avatar
                        alt={user.displayName}
                        src={user.photoURL}
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
            <Grid
                item
                xs={12}
                sm={3}
                className={classes.cell}
                component={Box}
                display="flex"
                alignItems="center">
                <UserRoleSelect
                    disabled={isMe || isOwner}
                    selectedUserRole={role}
                    userTypes={userTypes}
                    onRoleChange={(newRole) =>
                        onUserRoleValueChange(userId, role, newRole)
                    }
                />
                <OrganizationRoleInfo />
            </Grid>
            <Grid item xs={12} sm={3} className={classes.buttonCell}>
                {!isOwner && !isMe && (
                    <IconButton
                        aria-label="Remove the user from the event"
                        onClick={() => dispatch(removeUser(userId, role))}>
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
                    open={true}>
                    <TranslatedTypography i18nKey="organization.confirmOwner" />
                </SimpleDialog>
            )}
        </OFListItem>
    )
}

export default UserItem
