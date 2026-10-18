import { useState } from 'react'
import Button from '@mui/material/Button'
import { ChromePicker, type ColorResult } from 'react-color'
import Dialog from '@mui/material/Dialog'
import { makeStyles } from '@mui/styles'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
    chromePicker: {
        boxShadow: 'none !important',
        border: '1px solid #ccc',
    },
}))

interface ColorBlockDialogProps {
    /** Hex color without `#`. */
    color: string
    open: boolean
    /** Returns the handler closing the dialog with the given color. */
    onClose: (color: string) => () => void
    /** Returns the handler deleting the given color. */
    onColorDeleted: (color: string) => () => void
}

export const ColorBlockDialog = ({
    color,
    open,
    onClose,
    onColorDeleted,
}: ColorBlockDialogProps) => {
    const classes = useStyles()
    const [pickerColor, setColor] = useState(`#${color}`)
    const { t } = useTranslation()

    const onColorPicked = (data: ColorResult) => {
        setColor(data.hex)
    }

    return (
        <Dialog
            open={open}
            onClose={onClose(pickerColor.replace('#', ''))}
            aria-labelledby="dialog-color-picker"
        >
            <DialogTitle id="dialog-color-picker">
                {t('settingsEvent.chooseColor')}
            </DialogTitle>
            <DialogContent>
                <ChromePicker
                    color={pickerColor}
                    disableAlpha={true}
                    onChange={onColorPicked}
                    className={classes.chromePicker}
                />
                <br />
            </DialogContent>
            <DialogActions>
                <Button onClick={onColorDeleted(pickerColor.replace('#', ''))}>
                    <DeleteIcon />
                    {t('settingsEvent.delete')}
                </Button>
                <Button
                    onClick={onClose(pickerColor.replace('#', ''))}
                    color="primary"
                >
                    {t('settingsEvent.cancel')}
                </Button>
                <Button
                    onClick={onClose(pickerColor.replace('#', ''))}
                    color="primary"
                    variant="contained"
                >
                    {t('settingsEvent.pick')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
