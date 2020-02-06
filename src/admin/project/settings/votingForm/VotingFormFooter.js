import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import BottomActionLayout from '../../layout/BottomActionLayout'
import OFButton from '../../../baseComponents/button/OFButton'
import { useTranslation } from 'react-i18next'
import CachedIcon from '@material-ui/icons/Cached'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import { getProject } from '../../core/projectActions'
import { fillDefaultVotingForm, getVoteItems } from './votingFormActions'

const VotingForm = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [isDialogOpen, setDialogOpen] = useState(false)

    return (
        <BottomActionLayout>
            <OFButton
                onClick={() => setDialogOpen(true)}
                style={{ design: 'text' }}>
                <CachedIcon />
                {t('settingsVotingForm.resetToDefault')}
            </OFButton>

            <Dialog
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {t('settingsVotingForm.resetToDefaultDialogTitle')}
                </DialogTitle>
                <DialogActions>
                    <OFButton
                        onClick={() => setDialogOpen(false)}
                        style={{ design: 'text' }}>
                        {t('common.cancel')}
                    </OFButton>
                    <OFButton
                        onClick={() =>
                            dispatch(fillDefaultVotingForm(t, true)).then(
                                async () => {
                                    await dispatch(getProject())
                                    await dispatch(getVoteItems())
                                    setDialogOpen(false)
                                }
                            )
                        }>
                        {t('settingsVotingForm.resetToDefault')}
                    </OFButton>
                </DialogActions>
            </Dialog>
        </BottomActionLayout>
    )
}

export default VotingForm
