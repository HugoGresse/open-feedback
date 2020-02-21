import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import { DialogContent } from '@material-ui/core'
import OFButton from './button/OFButton'
import DialogActions from '@material-ui/core/DialogActions'
import CircularProgress from '@material-ui/core/CircularProgress'

const SimpleDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    children,
    confirmText,
    cancelText,
    confirmLoading,
}) => {
    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
                <DialogActions>
                    {cancelText && (
                        <OFButton onClick={onClose} style={{ design: 'text' }}>
                            {cancelText}
                        </OFButton>
                    )}
                    <OFButton onClick={onConfirm}>
                        {confirmText}
                        {confirmLoading && (
                            <CircularProgress
                                style={{
                                    height: 20,
                                    width: 20,
                                    color: 'white',
                                    marginLeft: 10,
                                }}
                            />
                        )}
                    </OFButton>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}

export default SimpleDialog
