import React, { useState } from 'react'
import OFButton from '../../baseComponents/button/OFButton'
import { useTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Grid from '@material-ui/core/Grid'
import { Box } from '@material-ui/core'
import { OrganizationSettings } from '../settings/OrganizationSettings'
import SettingsIcon from '@material-ui/icons/Settings'

export const OrganizationHeader = ({ organizationName, onClose }) => {
    const { t } = useTranslation()
    const [settingsDisplayed, setSettingsDisplayed] = useState(false)

    return (
        <>
            <OFButton
                onClick={onClose}
                startIcon={<ArrowBackIcon />}
                style={{
                    design: 'text',
                }}>
                {t('organization.goBackToProjects')}
            </OFButton>
            <Grid container>
                <Grid item xs={12} sm={9}>
                    <Typography variant="h2" color="primary">
                        {organizationName}
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={3}
                    component={Box}
                    display="flex"
                    alignSelf="center"
                    justifyContent="flex-end">
                    <OFButton
                        onClick={() => setSettingsDisplayed(true)}
                        style={{
                            design: 'text',
                        }}>
                        <SettingsIcon />
                        {t('organization.settings')}
                    </OFButton>
                </Grid>
            </Grid>

            <Typography variant="h5">{t('organization.title')}</Typography>

            {settingsDisplayed && (
                <OrganizationSettings
                    onClose={() => setSettingsDisplayed(false)}
                />
            )}
        </>
    )
}
