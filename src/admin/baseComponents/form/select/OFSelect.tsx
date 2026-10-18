import type { FocusEvent } from 'react'
import type { FieldProps } from 'formik'
import Select, { type BaseSelectProps } from '@mui/material/Select'
import { OFInput } from '../input/OFInput.tsx'

export interface OFSelectProps
    extends BaseSelectProps,
        Pick<FieldProps, 'field' | 'form'> {}

export const fieldToSelect = ({
    disabled,
    field: { onBlur: fieldOnBlur, ...field },
    form: { isSubmitting },
    onBlur,
    ...props
}: OFSelectProps) => {
    return {
        disabled: disabled ?? isSubmitting,
        onBlur:
            onBlur ??
            function (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
                fieldOnBlur(e ?? field.name)
            },
        ...field,
        ...props,
    }
}

export const OFSelect = (props: OFSelectProps) => {
    return <Select input={<OFInput />} {...fieldToSelect(props)} />
}
