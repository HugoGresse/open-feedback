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
                    ({field}) => (
                        <OFInput
                            name={fieldName}
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
