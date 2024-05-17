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
                                      disabled,
                                      autoComplete,
                                      onFocus,
                                      InputProps,
                                  }) => {
    return (
        <OFInput
            icon={icon}
            name={name}
            value={value}
            onClick={onClick}
            onError={onError}
            onBlur={onBlur}
            onFocus={() => {
                if(onFocus) {
                    onFocus()
                }
            }}
            onKeyDown={onKeyDown}
            inputRef={InputProps.ref}
            disabled={disabled}
            autoComplete={autoComplete}
        />
    )
}

export default OFInputForDateTimePicker
