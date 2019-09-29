import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import ColorBlock from './ColorBlock'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: '20px'
    },
    colorBlock: {
        float: 'left'
    },
    addButton: {
        float: 'left'
    }
}))

const ChipColorsEditor = ({ field, form }) => {
    const classes = useStyles()

    const onColorChanges = (oldColor, newColor) => {
        form.setFieldValue(
            field.name,
            field.value.map(color => {
                if (color === oldColor) {
                    return newColor
                }
                return color
            })
        )
    }

    const addColor = () => {
        const values = field.value || []
        // Generate new random color
        values.push(Math.floor(Math.random() * 16777215).toString(16))
        form.setFieldValue(field.name, values)
    }

    const onColorDeleted = color => {
        form.setFieldValue(
            field.name,
            field.value.filter(item => item !== color)
        )
    }

    return (
        <div className={classes.container}>
            {field.value && field.value.map((color, index) => {
                return (
                    <ColorBlock
                        key={index + color}
                        color={color}
                        className={classes.colorBlock}
                        disabled={form.isSubmitting}
                        onColorChanged={newColor =>
                            onColorChanges(color, newColor)
                        }
                        onColorDeleted={color => onColorDeleted(color)}
                    />
                )
            })}
            <IconButton
                className={classes.addButton}
                component="div"
                aria-label="new chip color"
                disabled={form.isSubmitting}
                onClick={() => addColor()}
            >
                <AddIcon />
            </IconButton>
        </div>
    )
}

export default ChipColorsEditor
