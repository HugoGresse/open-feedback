import OFInput from '../input/OFInput'
import React from 'react'
import { Field } from 'formik'
import OFFormControlFormiked from './OFFormControlFormiked'

const OFFormControlInputFormiked = ({
    name,
    fieldName,
    type,
    value,
    isSubmitting,
    displayErrorMessageDirectly = false,
    autoFocus = false,
}) => {
    return (
        <OFFormControlFormiked
            name={name}
            fieldName={fieldName}
            displayErrorMessageDirectly={displayErrorMessageDirectly}>
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
        </OFFormControlFormiked>
    )
}

export default OFFormControlInputFormiked
