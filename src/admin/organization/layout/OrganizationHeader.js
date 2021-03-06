import React from 'react'
import OFButton from '../../baseComponents/button/OFButton'
import { useTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

export const OrganizationHeader = ({ organizationName, onClose }) => {
    const { t } = useTranslation()

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

            <Typography variant="h2" color="primary">
                {organizationName}
            </Typography>
            <Typography variant="h5">{t('organization.title')}</Typography>
        </>
    )
}
