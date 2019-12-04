import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { ErrorMessage } from 'formik'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    formControl: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    label: {
        fontSize: theme.typography.fontSize * 1.2,
        position: 'relative',
        marginBottom: theme.spacing(1),
    },
    errorMessage: {
        color: 'red',
    },
}))

const OFFormControlFormiked = ({ name, fieldName, children }) => {
    const classes = useStyles()

    return (
        <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor={fieldName} className={classes.label}>
                {name}
            </InputLabel>
            {children}
            <ErrorMessage
                name={fieldName}
                render={msg => (
                    <Typography className={classes.errorMessage}>
                        {msg}
                    </Typography>
                )}
            />
        </FormControl>
    )
}

export default OFFormControlFormiked
