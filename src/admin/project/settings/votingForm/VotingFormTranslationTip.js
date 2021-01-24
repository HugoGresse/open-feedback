import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import TranslateIcon from '@material-ui/icons/Translate'
import NavLinkMui from '../../layout/NavLinkMui'
import RoutingMap from '../../../RoutingMap'

const useStyles = makeStyles((theme) => ({
    titleIcon: {
        top: 4,
        position: 'relative',
    },
    text: {
        color: '#999',
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center',
        padding: '0px 8px 16px',
    },
    link: {
        color: '#555',
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
}))

export const VotingFormTranslationTip = () => {
    const { t } = useTranslation()
    const classes = useStyles()

    return (
        <Typography variant="body1" className={classes.text}>
            <TranslateIcon className={classes.titleIcon} />
            {t('settingsVotingForm.tipLanguagesContent')}
            <NavLinkMui
                to={`..${RoutingMap.settingSetup.url}`}
                className={classes.link}>
                {t('settingsSetup.settings')}
            </NavLinkMui>
        </Typography>
    )
}
