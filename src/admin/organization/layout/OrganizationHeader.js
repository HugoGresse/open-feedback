import React from 'react'
import OFButton from '../../baseComponents/button/OFButton'
import { useTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'
import { Link as RouterLink } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

export const OrganizationHeader = ({ organizationName }) => {
    const { t } = useTranslation()

    return (
        <>
            <OFButton
                to="/admin"
                component={RouterLink}
                startIcon={<ArrowBackIcon />}
                style={{
                    design: 'text',
                }}>
                {t('organization.goBackToProjects')}
            </OFButton>

            <Typography variant="h2">{organizationName}</Typography>
            <Typography variant="h5">{t('organization.title')}</Typography>
        </>
    )
}
