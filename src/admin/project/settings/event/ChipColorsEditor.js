import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import ColorBlock from './ColorBlock'
import IconButton from '@material-ui/core/IconButton'
import { newRandomHexColor } from '../../../../utils/colorsUtils'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
    colorBlock: {
        float: 'left',
    },
    addButton: {
        float: 'left',
        padding: 8,
    },
}))

const ChipColorsEditor = ({ field, form }) => {
    const { t } = useTranslation()
    const classes = useStyles()

    const onColorChanges = (oldColor, newColor) => {
        form.setFieldValue(
            field.name,
            field.value.map((color) => {
                if (color === oldColor) {
                    return newColor
                }
                return color
            })
        )
    }

    const addColor = () => {
        const values = field.value || []
        values.push(newRandomHexColor())
        form.setFieldValue(field.name, values)
    }

    const onColorDeleted = (color) => {
        form.setFieldValue(
            field.name,
            field.value.filter((item) => item !== color)
        )
    }

    return (
        <div id="chipColors">
            {field.value &&
                field.value.map((color, index) => {
                    return (
                        <ColorBlock
                            key={index + color}
                            color={color}
                            className={classes.colorBlock}
                            disabled={form.isSubmitting}
                            onColorChanged={(newColor) =>
                                onColorChanges(color, newColor)
                            }
                            onColorDeleted={(color) => onColorDeleted(color)}
                        />
                    )
                })}
            <IconButton
                className={classes.addButton}
                aria-label={t('settingsEvent.newChipColors')}
                disabled={form.isSubmitting}
                onClick={() => addColor()}>
                <AddIcon />
            </IconButton>
        </div>
    )
}

export default ChipColorsEditor
