import React from 'react'
import OFInput from './OFInput'

const OFInputForDateTimePicker = ({icon, name, value, onClick, onError, onKeyDown, inputRef, disabled}) => {
    return <OFInput icon={icon}
                    name={name}
                    value={value}
                    onClick={onClick}
                    onError={onError}
                    onKeyDown={onKeyDown}
                    inputRef={inputRef}
                    disabled={disabled}
    />
}

export default OFInputForDateTimePicker
