/* eslint-disable no-unused-vars */
import React, { useRef } from 'react'
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
                                      focused,
...otherProps
                                  }) => {
    const otherRef = useRef()
    const {ref, endAdornment, ...otherInputProps} = InputProps
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
            forwardedRef={InputProps.ref || otherRef}
            disabled={disabled}
            autoComplete={autoComplete}
            {...otherInputProps}
            {...otherProps}
        />
    )
}

export default OFInputForDateTimePicker
