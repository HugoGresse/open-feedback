import * as React from 'react'
import Select from '@mui/material/Select'
import OFInput from '../input/OFInput.jsx'

export const fieldToSelect = ({
    disabled,
    field: { onBlur: fieldOnBlur, ...field },
    form: { isSubmitting },
    onBlur,
    ...props
}) => {
    return {
        disabled: disabled ?? isSubmitting,
        onBlur:
            onBlur ??
            function (e) {
                fieldOnBlur(e ?? field.name)
            },
        ...field,
        ...props,
    }
}

export const OFSelect = (props) => {
    return <Select input={<OFInput />} {...fieldToSelect(props)} />
}
