import RadioGroup from '@mui/material/RadioGroup'
import { ErrorMessage } from 'formik'
import { Typography } from '@mui/material'

export const RadioButtonGroup = ({ fieldName, children }) => {
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
