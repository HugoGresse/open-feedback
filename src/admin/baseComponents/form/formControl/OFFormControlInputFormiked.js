import OFInput from '../input/OFInput'
import React from 'react'
import { Field } from 'formik'
import OFFormControl from './OFFormControl'

const OFFormControlInputFormiked = ({
    name,
    fieldName,
    type,
    value,
    isSubmitting,
    displayErrorMessageDirectly = false,
    autoFocus = false,
    color = 'primary',
}) => {
    return (
        <OFFormControl
            name={name}
            fieldName={fieldName}
            displayErrorMessageDirectly={displayErrorMessageDirectly}
            color={color}>
            <Field type={type} name={fieldName} disabled={isSubmitting}>
                {({ field, form }) => (
                    <OFInput
                        error={!!form.errors[field.name]}
                        name={field.name}
                        value={value}
                        disabled={isSubmitting}
                        autoFocus={autoFocus}
                        {...field}
                    />
                )}
            </Field>
        </OFFormControl>
    )
}

export default OFFormControlInputFormiked
