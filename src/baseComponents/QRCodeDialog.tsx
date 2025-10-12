import React, { lazy, Suspense } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { CircularProgress, Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

const QRCode = lazy(() =>
    import('./QRCode').then((module) => ({ default: module.QRCode }))
)

interface QRCodeDialogProps {
    open: boolean
    onClose: () => void
    value: string
    eventColor?: string
    title?: string
    size?: number
    fileName?: string
    logo?: string
}

export const QRCodeDialog: React.FC<QRCodeDialogProps> = ({
    open,
    onClose,
    value,
    eventColor = '#000000',
    title = 'QR Code',
    fileName = 'qr-code',
    size = 300,
    logo,
}) => {
    const { t } = useTranslation()

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="qr-code-dialog-title"
            maxWidth="sm"
            fullWidth>
            <DialogTitle
                id="qr-code-dialog-title"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={size}
                    sx={{
                        borderRadius: 1,
                        padding: 2,
                    }}>
                    {open && (
                        <Suspense
                            fallback={
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    width={size}
                                    height={size}>
                                    <CircularProgress />
                                </Box>
                            }>
                            <QRCode
                                data={value}
                                size={size}
                                eventColor={
                                    eventColor
                                        ? eventColor.startsWith('#')
                                            ? eventColor
                                            : `#${eventColor}`
                                        : undefined
                                }
                                className="qr-code-dialog-qr"
                                showDownload
                                downloadFileName={fileName}
                                logo={logo}
                            />
                        </Suspense>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="text" color="primary">
                    {t('qrCode.close')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
