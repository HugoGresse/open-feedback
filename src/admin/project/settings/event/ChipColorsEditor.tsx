import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import { ColorBlock } from './ColorBlock.tsx'
import IconButton from '@mui/material/IconButton'
import { newRandomHexColor } from '../../../../utils/colorsUtils'
import { useTranslation } from 'react-i18next'
import type { FieldProps } from 'formik'

const useStyles = makeStyles(() => ({
    colorBlock: {
        float: 'left',
    },
    addButton: {
        float: 'left',
        padding: 8,
    },
}))

/** Hex colors without `#`. */
export type ChipColorsEditorProps = FieldProps<string[] | undefined>

export const ChipColorsEditor = ({ field, form }: ChipColorsEditorProps) => {
    const { t } = useTranslation()
    const classes = useStyles()

    const onColorChanges = (oldColor: string, newColor: string) => {
        form.setFieldValue(
            field.name,
            field.value?.map((color) => {
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

    const onColorDeleted = (color: string) => {
        form.setFieldValue(
            field.name,
            field.value?.filter((item) => item !== color)
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
                onClick={() => addColor()}
                size="large"
            >
                <AddIcon />
            </IconButton>
        </div>
    )
}
