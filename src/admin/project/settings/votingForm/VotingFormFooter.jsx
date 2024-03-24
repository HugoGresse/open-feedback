import React, { useState } from 'react'
import BottomActionLayout from '../../layout/BottomActionLayout.jsx'
import OFButton from '../../../baseComponents/button/OFButton.jsx'
import { useTranslation } from 'react-i18next'
import CachedIcon from '@mui/icons-material/Cached'
import SimpleDialog from '../../../baseComponents/layouts/SimpleDialog.jsx'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography.jsx'

const VotingFormFooter = ({ reset }) => {
    const { t } = useTranslation()
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    return (
        <BottomActionLayout>
            <OFButton
                onClick={() => setDialogOpen(true)}
                style={{ design: 'text' }}>
                <CachedIcon />
                {t('settingsVotingForm.resetToDefault')}
            </OFButton>

            <SimpleDialog
                onClose={() => setDialogOpen(false)}
                onConfirm={() => {
                    setIsSaving(true)
                    reset().finally(() => {
                        setDialogOpen(false)
                        setIsSaving(false)
                    })
                }}
                title={t('settingsVotingForm.resetToDefaultDialogTitle')}
                cancelText={t('common.cancel')}
                confirmText={t('settingsVotingForm.resetToDefault')}
                confirmLoading={isSaving}
                open={isDialogOpen}>
                <TranslatedTypography i18nKey="settingsVotingForm.resetToDefaultDialogDesc" />
            </SimpleDialog>
        </BottomActionLayout>
    )
}

export default VotingFormFooter
