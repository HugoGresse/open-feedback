import OFInput from './OFInput'
import React from 'react'
import {Field} from 'formik'
import OFFormControlFormiked from './OFFormControlFormiked'

const OFFormControlInputFormiked = ({
                                        name,
                                        fieldName,
                                        type,
                                        value,
                                        isSubmitting
                                    }) => {
    return (
        <OFFormControlFormiked name={name} fieldName={fieldName}>
            <Field
                type={type}
                name={fieldName}
                disabled={isSubmitting}
            >
                {
                    ({field, form}) => (
                        <OFInput
                            error={!!form.errors[field.name]}
                            name={field.name}
                            value={value}
                            disabled={isSubmitting}
                            {...field}
                        />
                    )
                }
            </Field>
        </OFFormControlFormiked>
    )
}

export default OFFormControlInputFormiked
