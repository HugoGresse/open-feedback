import type { ReactNode } from 'react'
import { OFInput } from '../input/OFInput.tsx'
import { Field, type FieldProps } from 'formik'
import { OFFormControl, type OFFormControlProps } from './OFFormControl.tsx'

export interface OFFormControlInputFormikedProps {
    // Label displayed above the input
    name?: ReactNode
    fieldName: string
    type?: string
    // Ignored: the input value always comes from the Formik field.
    value?: unknown
    isSubmitting?: boolean
    displayErrorMessageDirectly?: boolean
    autoFocus?: boolean
    color?: OFFormControlProps['color']
}

export const OFFormControlInputFormiked = ({
    name,
    fieldName,
    type,
    isSubmitting,
    displayErrorMessageDirectly = false,
    autoFocus = false,
    color = 'primary',
}: OFFormControlInputFormikedProps) => {
    return (
        <OFFormControl
            name={name}
            fieldName={fieldName}
            displayErrorMessageDirectly={displayErrorMessageDirectly}
            color={color}
        >
            <Field type={type} name={fieldName} disabled={isSubmitting}>
                {({ field, form }: FieldProps) => (
                    <OFInput
                        error={!!form.errors[field.name]}
                        disabled={isSubmitting}
                        autoFocus={autoFocus}
                        {...field}
                    />
                )}
            </Field>
        </OFFormControl>
    )
}
