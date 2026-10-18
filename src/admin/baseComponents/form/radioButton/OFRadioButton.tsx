import type { ReactNode } from 'react'
import type { FieldProps } from 'formik'
import FormControlLabel, {
    type FormControlLabelProps,
} from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
    root: {
        alignItems: 'start',
    },
    label: {
        padding: 4,
    },
}))

export interface OFRadioButtonProps
    extends Omit<
        FormControlLabelProps,
        'id' | 'label' | 'control' | 'name' | 'value' | 'checked'
    > {
    field: FieldProps['field']
    // The option value, also used as the element id
    id: string
    label: ReactNode
}

export const OFRadioButton = ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    ...props
}: OFRadioButtonProps) => {
    const classes = useStyles()

    return (
        <FormControlLabel
            name={name}
            id={id}
            value={id}
            checked={id === value}
            onChange={onChange}
            onBlur={onBlur}
            control={<Radio color="primary" />}
            label={label}
            classes={{
                root: classes.root,
                label: classes.label,
            }}
            {...props}
        />
    )
}
