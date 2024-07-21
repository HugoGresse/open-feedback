import React, { lazy, Suspense } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import OFButton from '../../baseComponents/button/OFButton.jsx'
import GetAppIcon from '@mui/icons-material/GetApp'
import FileSaver from 'file-saver'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { useTranslation } from 'react-i18next'
const QRCode = lazy(() => import('qrcode.react'))

const QRCodeDialog = ({ open, handleClose, data, name }) => {
    const { t } = useTranslation()

    const downloadImage = () => {
        const canvas = document.querySelector('#dialog-qrcode canvas')
        if (canvas) {
            FileSaver.saveAs(canvas.toDataURL(), `${name} QRCode.png`)
        } else {
            // eslint-disable-next-line no-console
            console.log(
                'Unable to save the canvas, maybe the canvas has not been rendered? '
            )
        }
    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={open}
            id="dialog-qrcode">
            <DialogContent>
                <Suspense fallback={<LoaderMatchParent />}>
                    <QRCode
                        value={data}
                        size={300}
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </Suspense>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'space-between' }}>
                <OFButton onClick={downloadImage}>
                    <GetAppIcon />
                    {t('common.download')}
                </OFButton>
                <OFButton onClick={handleClose} style={{ design: 'text' }}>
                    {t('common.close')}
                </OFButton>
            </DialogActions>
        </Dialog>
    )
}

export default QRCodeDialog
