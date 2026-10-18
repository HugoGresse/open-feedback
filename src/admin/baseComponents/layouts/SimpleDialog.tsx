import type { ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { DialogContent } from '@mui/material'
import { OFButton } from '../button/OFButton.tsx'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'

export interface SimpleDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    children?: ReactNode
    confirmText: ReactNode
    cancelText?: ReactNode
    confirmLoading?: boolean
}

export const SimpleDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    children,
    confirmText,
    cancelText,
    confirmLoading,
}: SimpleDialogProps) => {
    return (
        <Dialog onClose={onClose} open={open} aria-labelledby={title}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
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
        </Dialog>
    )
}
