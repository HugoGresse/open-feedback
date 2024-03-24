import React from 'react'
import { useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import OFButton from './button/OFButton.jsx'
import DialogContentText from '@mui/material/DialogContentText'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

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
