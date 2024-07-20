import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import React from 'react'
import { ErrorMessage, useField } from 'formik'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'

const useStyles = makeStyles((theme) => ({
    focusedLabel: {
        color: `${theme.palette.primary.inputLabel} !important`,
    },
}))

const OFFormControl = ({
    name,
    fieldName,
    displayErrorMessageDirectly,
    children,
    noTopMargin,
    color,
}) => {
    const theme = useTheme()
    const classes = useStyles({
        noTopMargin,
    })
    const [, meta] = useField(fieldName)

    return (
        <FormControl sx={{
            width: '100%',
            marginTop: !noTopMargin ? 3 : 0,
        }}>
            <InputLabel
                shrink
                htmlFor={fieldName}
                variant="standard"
                sx={{
                    fontSize: theme.typography.fontSize * 1.2,
                    position: 'relative',
                }}
                classes={{
                    focused: classes.focusedLabel,
                }}
                color={color}>
                {name}
            </InputLabel>
            {children}
            {displayErrorMessageDirectly && meta.error && (
                <Typography sx={{
                    color: 'red',
                }} role="alert">
                    {meta.error}
                </Typography>
            )}
            {!displayErrorMessageDirectly && (
                <ErrorMessage
                    name={fieldName}
                    render={(msg) => (
                        <Typography
                            className={classes.errorMessage}
                            role="alert">
                            {msg}
                        </Typography>
                    )}
                />
            )}
        </FormControl>
    )
}

export default OFFormControl
