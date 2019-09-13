import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import { ChromePicker } from 'react-color'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteIcon from '@material-ui/icons/Delete'

const ColorBlockDialog = ({ color, open, onClose, onColorDeleted }) => {
    const [pickerColor, setColor] = useState(`#${color}`)

    const onColorPicked = data => {
        setColor(data.hex)
    }

    return (
        <Dialog
            open={open}
            onClose={onClose(pickerColor.replace('#', ''))}
            aria-labelledby="dialog-color-picker"
        >
            <DialogTitle id="dialog-color-picker">Choose the color</DialogTitle>
            <DialogContent>
                <ChromePicker
                    color={pickerColor}
                    disableAlpha={true}
                    onChangeComplete={onColorPicked}
                />
                <br />
            </DialogContent>
            <DialogActions>
                <Button onClick={onColorDeleted(pickerColor.replace('#', ''))}>
                    <DeleteIcon />
                    Delete
                </Button>
                <Button
                    onClick={onClose(pickerColor.replace('#', ''))}
                    color="primary"
                >
                    Cancel
                </Button>
                <Button
                    onClick={onClose(pickerColor.replace('#', ''))}
                    color="primary"
                    variant="contained"
                >
                    Pick
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ColorBlockDialog
