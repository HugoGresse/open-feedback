import React from 'react'
import MuiSwitch from '@material-ui/core/Switch'

const fieldToSwitch = ({
    field,
    form: { isSubmitting },
    disabled,
    ...props
}) => {
    return {
        disabled: disabled !== undefined ? disabled : isSubmitting,
        ...props,
        ...field,
        value: Boolean(field.name),
        checked: field.value,
    }
}

export const OFSwitch = props => <MuiSwitch {...fieldToSwitch(props)} />
