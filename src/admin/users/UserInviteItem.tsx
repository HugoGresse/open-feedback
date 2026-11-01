import { useEffect } from 'react'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveButton from '@mui/icons-material/RemoveCircle'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import type { Theme } from '@mui/material/styles'
import { OFListItem } from '../baseComponents/layouts/OFListItem.tsx'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { TranslatedTypography } from '../baseComponents/TranslatedTypography.tsx'
import { DateTime } from 'luxon'
import type { Invite, Timestamp } from '../../core/models'

const useStyles = makeStyles((theme: Theme) => ({
    icon: {
        width: 40,
        height: 40,
        paddingRight: 12,
    },
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

const dateFormat = Object.assign({}, DateTime.DATE_SHORT, {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
})

/** How long an accepted invite stays listed, shown as accepted. */
const ACCEPTED_INVITE_DISPLAY_MS = 4000

export interface UserInviteItemProps {
    invite: Invite
    cancelInvite: (inviteId: string) => void
    onAcceptedShown: (inviteId: string) => void
}

export const UserInviteItem = ({
    invite,
    cancelInvite,
    onAcceptedShown,
}: UserInviteItemProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const isAccepted = invite.status === 'completed'

    useEffect(() => {
        if (!isAccepted) {
            return
        }
        const timeout = setTimeout(
            () => onAcceptedShown(invite.id),
            ACCEPTED_INVITE_DISPLAY_MS
        )
        return () => clearTimeout(timeout)
    }, [isAccepted, invite.id, onAcceptedShown])

    const inviteStatus = invite.status
        ? t(`users.invite.${invite.status}`)
        : t('users.invite.default')

    return (
        <OFListItem>
            <Grid item xs={12} sm={7} className={classes.cell}>
                <Box display="flex">
                    {isAccepted ? (
                        <CheckCircleIcon
                            className={classes.icon}
                            color="success"
                        />
                    ) : (
                        <ScheduleIcon className={classes.icon} />
                    )}
                    <Box>
                        <Typography>{invite.destinationUserInfo}</Typography>
                        <Typography style={{ color: '#999' }}>
                            {t('users.invitation')} <b>{inviteStatus}</b>{' '}
                            {t('users.on')}{' '}
                            {DateTime.fromJSDate(
                                // Read from Firestore or set with nowTimestamp()
                                (invite.updatedAt as Timestamp).toDate()
                            ).toLocaleString(dateFormat)}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.cell}>
                {'role' in invite && invite.role ? (
                    <Typography>{t(`users.${invite.role}`)}</Typography>
                ) : (
                    <TranslatedTypography i18nKey="users.Member" />
                )}
            </Grid>
            <Grid item xs={12} sm={2} className={classes.buttonCell}>
                {!isAccepted && (
                    <IconButton
                        aria-label="Cancel the invitation"
                        onClick={() => cancelInvite(invite.id)}
                        size="large"
                    >
                        <RemoveButton />
                    </IconButton>
                )}
            </Grid>
        </OFListItem>
    )
}
