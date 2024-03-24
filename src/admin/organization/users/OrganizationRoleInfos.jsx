import React, { useState } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import SimpleDialog from '../../baseComponents/layouts/SimpleDialog.jsx'
import { useTranslation } from 'react-i18next'
import TranslatedTypography from '../../baseComponents/TranslatedTypography.jsx'
import IconButton from '@mui/material/IconButton'

export const OrganizationRoleInfo = () => {
    const { t } = useTranslation()
    const [modalOpen, setModalOpen] = useState(false)

    return <>
        <IconButton
            onClick={() => setModalOpen(true)}
            aria-label={t('organization.rolesTitle')}
            size="large">
            <InfoIcon />
        </IconButton>
        <SimpleDialog
            open={modalOpen}
            title={t('organization.rolesTitle')}
            confirmText={t('common.back')}
            onClose={() => setModalOpen(false)}
            onConfirm={() => setModalOpen(false)}>
            <TranslatedTypography i18nKey="users.Viewer" variant="h6" />
            <TranslatedTypography
                i18nKey="organization.roles.viewer"
                gutterBottom
            />
            <TranslatedTypography i18nKey="users.Editor" variant="h6" />
            <TranslatedTypography
                i18nKey="organization.roles.editor"
                gutterBottom
            />
            <TranslatedTypography i18nKey="users.Admin" variant="h6" />
            <TranslatedTypography
                i18nKey="organization.roles.admin"
                gutterBottom
            />
            <TranslatedTypography i18nKey="users.Owner" variant="h6" />
            <TranslatedTypography
                i18nKey="organization.roles.owner"
                gutterBottom
            />
        </SimpleDialog>
    </>;
}
