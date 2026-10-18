import type { ReactNode } from 'react'
import RadioGroup from '@mui/material/RadioGroup'
import { ErrorMessage } from 'formik'
import { Typography } from '@mui/material'

export interface RadioButtonGroupProps {
    fieldName: string
    children?: ReactNode
}

export const RadioButtonGroup = ({
    fieldName,
    children,
}: RadioButtonGroupProps) => {
    return (
        <RadioGroup>
            {children}
            <ErrorMessage
                name={fieldName}
                render={(msg) => (
                    <Typography style={{ color: 'red' }}>{msg}</Typography>
                )}
            />
        </RadioGroup>
    )
}
