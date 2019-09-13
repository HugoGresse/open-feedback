import OFInput from './OFInput'
import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Field } from 'formik'
import OFFormControlFormiked from './OFFormControlFormiked'

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

const OFFormControlInputFormiked = ({
    name,
    fieldName,
    type,
    value,
    isSubmitting
}) => {
    const classes = useStyles()

    return (
        <OFFormControlFormiked name={name} fieldName={fieldName}>
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
        </OFFormControlFormiked>
    )
}

export default OFFormControlInputFormiked
