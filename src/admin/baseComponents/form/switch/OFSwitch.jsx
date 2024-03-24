import React from 'react'
import MuiSwitch from '@mui/material/Switch'
import OFInput from '../input/OFInput.jsx'

const fieldToSwitch = ({
    field,
    form: { isSubmitting },
    disabled,
    ...props
}) => {
    return {
        disabled: disabled !== undefined ? disabled : isSubmitting,
        color: 'primary',
        ...props,
        ...field,
        value: Boolean(field.name),
        checked: field.value,
    }
}

export const OFSwitch = (props) => (
    <MuiSwitch input={<OFInput />} {...fieldToSwitch(props)} />
)
