import React from 'react'
import OFInput from '../input/OFInput.jsx'

const OFInputForDateTimePicker = ({
    icon,
    name,
    value,
    onClick,
    onError,
    onBlur,
    onKeyDown,
    inputRef,
    disabled,
    autoComplete,
}) => {
    return (
        <OFInput
            icon={icon}
            name={name}
            value={value}
            onClick={onClick}
            onError={onError}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            inputRef={inputRef}
            disabled={disabled}
            autoComplete={autoComplete}
        />
    )
}

export default OFInputForDateTimePicker
