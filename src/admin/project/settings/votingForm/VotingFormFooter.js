import React, { useState } from 'react'
import BottomActionLayout from '../../layout/BottomActionLayout'
import OFButton from '../../../baseComponents/button/OFButton'
import { useTranslation } from 'react-i18next'
import CachedIcon from '@material-ui/icons/Cached'
import SimpleDialog from '../../../baseComponents/layouts/SimpleDialog'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography'

const VotingFormFooter = ({ onResetPress }) => {
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
                    onResetPress().then(() => {
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
