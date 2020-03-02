import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import BottomActionLayout from '../../layout/BottomActionLayout'
import OFButton from '../../../baseComponents/button/OFButton'
import { useTranslation } from 'react-i18next'
import CachedIcon from '@material-ui/icons/Cached'
import { getProject } from '../../core/projectActions'
import {
    fillDefaultVotingForm,
    getVoteItems,
    saveVoteItems,
} from './votingFormActions'
import SimpleDialog from '../../../baseComponents/layouts/SimpleDialog'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography'
import { sleep } from '../../../../utils/sleep'

const VotingForm = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
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
                    dispatch(fillDefaultVotingForm(t, true)).then(async () => {
                        await dispatch(saveVoteItems())
                        await sleep(1000) // dela on firestore...
                        await dispatch(getProject())
                        await dispatch(getVoteItems())
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

export default VotingForm
