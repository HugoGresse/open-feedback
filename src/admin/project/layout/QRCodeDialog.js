import React, { lazy, Suspense } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import OFButton from '../../baseComponents/OFButton'
import GetAppIcon from '@material-ui/icons/GetApp'
import FileSaver from 'file-saver'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
const QRCode = lazy(() => import('qrcode.react'))

const QRCodeDialog = ({ open, handleClose, data, name }) => {
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
                    Download
                </OFButton>
                <OFButton onClick={handleClose} style={{ design: 'text' }}>
                    Close
                </OFButton>
            </DialogActions>
        </Dialog>
    )
}

export default QRCodeDialog
