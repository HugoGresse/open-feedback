import { useState } from 'react'
import { OFButton } from '../../baseComponents/button/OFButton.tsx'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'
import { OrganizationSettings } from '../settings/OrganizationSettings.tsx'
import SettingsIcon from '@mui/icons-material/Settings'
import { OrganizationName } from './OrganizationName.tsx'
import { useAppDispatch, useAppSelector } from '../../../store'
import { isOrganizationRightAllowed } from '../core/organizationSelectors'
import { editOrganization } from '../core/actions/editOrganization'

export interface OrganizationHeaderProps {
    organizationName: string
    onClose: () => void
}

export const OrganizationHeader = ({
    organizationName,
    onClose,
}: OrganizationHeaderProps) => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const canEdit = useAppSelector(isOrganizationRightAllowed)
    const [settingsDisplayed, setSettingsDisplayed] = useState(false)

    return (
        <>
            <OFButton
                onClick={onClose}
                startIcon={<ArrowBackIcon />}
                style={{
                    design: 'text',
                }}
            >
                {t('organization.goBackToProjects')}
            </OFButton>
            <Grid container>
                <Grid item xs={12} sm={9}>
                    <OrganizationName
                        name={organizationName}
                        editable={canEdit}
                        onSave={(name) => dispatch(editOrganization({ name }))}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={3}
                    component={Box}
                    display="flex"
                    alignSelf="center"
                    justifyContent="flex-end"
                >
                    <OFButton
                        onClick={() => setSettingsDisplayed(true)}
                        style={{
                            design: 'text',
                        }}
                    >
                        <SettingsIcon />
                        {t('organization.settings')}
                    </OFButton>
                </Grid>
            </Grid>

            <Typography variant="h5">{t('organization.title')}</Typography>

            {settingsDisplayed && (
                <OrganizationSettings
                    onClose={() => setSettingsDisplayed(false)}
                    onOrganizationDeleted={onClose}
                />
            )}
        </>
    )
}
