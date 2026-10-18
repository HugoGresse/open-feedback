import { useState } from 'react'
import type { FieldProps } from 'formik'
import type { DateTime } from 'luxon'
import { OFInputForDateTimePicker } from './OFInputForDateTimePicker.tsx'
import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers'

export interface OFDateTimePickerProps
    extends
        Pick<FieldProps<DateTime | null>, 'field' | 'form'>,
        Omit<
            Partial<DateTimePickerProps<DateTime>>,
            'name' | 'value' | 'format'
        > {
    format?: string
    // Legacy (MUI pickers v4) prop, ignored by the current DateTimePicker.
    initialFocusedDate?: unknown
}

export const OFDateTimePicker = ({
    field,
    form,
    format,
    ...other
}: OFDateTimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [closeTime, setCloseTime] = useState<number | null>(null)
    const currentError = form.errors[field.name]

    const maybeOpenPicker = () => {
        form.setTouched({ [field.name]: true })
        if (isOpen) {
            return
        }
        // Prevent the input re-focus to display the picker when the picker is just closed
        if (Date.now() - (closeTime ?? 0) > 1000) {
            setIsOpen(true)
        }
    }

    return (
        <DateTimePicker<DateTime>
            open={isOpen}
            onClose={() => {
                setCloseTime(Date.now())
                setIsOpen(false)
            }}
            disabled={!!form.isSubmitting}
            name={field.name}
            value={field.value}
            format={format}
            minutesStep={5}
            ampm={false}
            onError={(error) => {
                // handle as a side effect
                if (error !== currentError) {
                    // The picker reports `null` when the value is valid; it is
                    // stored as is in Formik errors.
                    form.setFieldError(field.name, error as string | undefined)
                }
            }}
            onChange={(date) => form.setFieldValue(field.name, date, false)}
            slots={{
                textField: OFInputForDateTimePicker,
            }}
            slotProps={{
                textField: {
                    onFocus: maybeOpenPicker,
                    onClick: maybeOpenPicker,
                },
            }}
            {...other}
        />
    )
}
