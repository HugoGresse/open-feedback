import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { ErrorMessage, useField } from 'formik'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    formControl: {
        width: '100%',
        marginTop: (props) => !props.noTopMargin && theme.spacing(3),
    },
    label: {
        fontSize: theme.typography.fontSize * 1.2,
        position: 'relative',
        marginBottom: theme.spacing(1),
    },
    focusedLabel: {
        color: `${theme.palette.primary.inputLabel} !important`,
    },
    errorMessage: {
        color: 'red',
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
    const classes = useStyles({
        noTopMargin,
    })
    const [, meta] = useField(fieldName)

    return (
        <FormControl className={classes.formControl}>
            <InputLabel
                shrink
                htmlFor={fieldName}
                className={classes.label}
                classes={{
                    focused: classes.focusedLabel,
                }}
                color={color}>
                {name}
            </InputLabel>
            {children}
            {displayErrorMessageDirectly && meta.error && (
                <Typography className={classes.errorMessage} role="alert">
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
