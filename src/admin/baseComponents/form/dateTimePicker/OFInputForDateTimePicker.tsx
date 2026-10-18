import { useRef, type ReactNode, type Ref } from 'react'
import type { InputBaseProps } from '@mui/material/InputBase'
import { OFInput, type OFInputProps } from '../input/OFInput.tsx'

/**
 * Props received from the date picker `textField` slot (TextField-like props).
 */
export interface OFInputForDateTimePickerProps
    extends Omit<OFInputProps, 'onFocus'> {
    icon?: ReactNode
    onFocus?: () => void
    InputProps: Partial<InputBaseProps> & { ref?: Ref<HTMLDivElement> }
    focused?: boolean
}

export const OFInputForDateTimePicker = ({
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
}: OFInputForDateTimePickerProps) => {
    const otherRef = useRef<HTMLDivElement>(null)
    const { ref, endAdornment, ...otherInputProps } = InputProps
    return (
        <OFInput
            icon={icon}
            name={name}
            value={value}
            onClick={onClick}
            onError={onError}
            onBlur={onBlur}
            onFocus={() => {
                if (onFocus) {
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
