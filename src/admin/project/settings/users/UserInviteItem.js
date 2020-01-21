import React from 'react'
import ScheduleIcon from '@material-ui/icons/Schedule'
import RemoveButton from '@material-ui/icons/RemoveCircle'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import OFListItem from '../../../baseComponents/layouts/OFListItem'
import { Box } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from 'react-i18next'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography'
import DateTime from 'luxon/src/datetime'

const useStyles = makeStyles(theme => ({
    icon: {
        width: 40,
        height: 40,
        paddingRight: 12,
    },
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

const UserInviteItem = ({ invite, cancelInvite }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    let inviteStatus = invite.status
        ? t(`settingsUser.invite.${invite.status}`)
        : t('settingsUser.invite.default')

    return (
        <OFListItem>
            <Grid item xs={12} sm={6} className={classes.cell}>
                <Box display="flex">
                    <ScheduleIcon className={classes.icon} />
                    <Box>
                        <Typography>{invite.destinationUserInfo}</Typography>
                        <Typography style={{ color: '#999' }}>
                            {t('settingsUser.invitation')} {inviteStatus}{' '}
                            {t('settingsUser.on')}{' '}
                            {DateTime.fromJSDate(
                                invite.updatedAt.toDate()
                            ).toFormat('DDD')}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.cell}>
                <TranslatedTypography i18nKey="settingsUser.status">
                    Invitation to become Member
                </TranslatedTypography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.buttonCell}>
                <IconButton
                    aria-label="Cancel the invitation"
                    onClick={() => cancelInvite(invite.id)}>
                    <RemoveButton />
                </IconButton>
            </Grid>
        </OFListItem>
    )
}

export default UserInviteItem
