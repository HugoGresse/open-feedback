import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import { ChromePicker } from 'react-color'
import Dialog from '@material-ui/core/Dialog'
import makeStyles from '@material-ui/core/styles/makeStyles'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteIcon from '@material-ui/icons/Delete'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
    chromePicker: {
        boxShadow: 'none !important',
        border: '1px solid #ccc',
    },
}))

const ColorBlockDialog = ({ color, open, onClose, onColorDeleted }) => {
    const classes = useStyles()
    const [pickerColor, setColor] = useState(`#${color}`)
    const { t } = useTranslation()

    const onColorPicked = data => {
        setColor(data.hex)
    }

    return (
        <Dialog
            open={open}
            onClose={onClose(pickerColor.replace('#', ''))}
            aria-labelledby="dialog-color-picker">
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
                    color="primary">
                    {t('settingsEvent.cancel')}
                </Button>
                <Button
                    onClick={onClose(pickerColor.replace('#', ''))}
                    color="primary"
                    variant="contained">
                    {t('settingsEvent.pick')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ColorBlockDialog
