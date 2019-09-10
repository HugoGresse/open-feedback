import InputLabel from '@material-ui/core/InputLabel'
import OFInput from './OFInput'
import FormControl from '@material-ui/core/FormControl'
import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { ErrorMessage, Field } from 'formik'

const useStyles = makeStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3)
        }
    },
    formControl: {
        width: '100%',
        marginTop: theme.spacing(3)
    },
    label: {
        fontSize: theme.typography.fontSize * 1.2
    }
}))

const OFFormControlFormiked = ({
    name,
    fieldName,
    type,
    value,
    isSubmitting
}) => {
    const classes = useStyles()

    return (
        <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor={fieldName} className={classes.label}>
                {name}
            </InputLabel>
            <Field
                type={type}
                name={fieldName}
                render={({ field }) => (
                    <OFInput
                        className={classes.root}
                        name={fieldName}
                        value={value}
                        disabled={isSubmitting}
                        {...field}
                    />
                )}
                disabled={isSubmitting}
            />
            <ErrorMessage name={fieldName} />
        </FormControl>
    )
}

export default OFFormControlFormiked
