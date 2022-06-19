import React from 'react'
import { useTranslation } from 'react-i18next'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import OFButton from './button/OFButton'
import DialogContentText from '@material-ui/core/DialogContentText'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'

export const DonateToActivateDialog = ({ isDialogOpen, onClose }) => {
    const { t } = useTranslation()

    return (
        <Dialog
            open={isDialogOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <b>{t('common.donationHint')}</b>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <OFButton onClick={onClose} style={{ design: 'text' }}>
                    {t('common.close')}
                </OFButton>
                <OFButton
                    onClick={() => {
                        onClose()
                    }}
                    component="a"
                    href="https://github.com/sponsors/HugoGresse"
                    target="_blank"
                    endIcon={<OpenInNewIcon />}
                    style={{ customBg: '#FF2222' }}
                >
                    {t('common.donationContinue')}
                </OFButton>
            </DialogActions>
        </Dialog>
    )
}
