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

    // By index: two swatches can hold the same color
    const onColorChanges = (colorIndex: number, newColor: string) => {
        form.setFieldValue(
            field.name,
            field.value?.map((color, index) =>
                index === colorIndex ? newColor : color
            )
        )
    }

    const addColor = () => {
        // field.value is the Redux project array: copy it, never mutate it
        form.setFieldValue(field.name, [
            ...(field.value ?? []),
            newRandomHexColor(),
        ])
    }

    const onColorDeleted = (colorIndex: number) => {
        form.setFieldValue(
            field.name,
            field.value?.filter((_, index) => index !== colorIndex)
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
                                onColorChanges(index, newColor)
                            }
                            onColorDeleted={() => onColorDeleted(index)}
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
