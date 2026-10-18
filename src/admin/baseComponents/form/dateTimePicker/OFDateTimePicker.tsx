import { useState } from 'react'
import type { FieldProps } from 'formik'
import type { DateTime } from 'luxon'
import { OFInputForDateTimePicker } from './OFInputForDateTimePicker.tsx'
import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers'
import { toReferenceDate } from './toReferenceDate'

export interface OFDateTimePickerProps
    extends
        Pick<FieldProps<DateTime | null>, 'field' | 'form'>,
        Omit<
            Partial<DateTimePickerProps<DateTime>>,
            'name' | 'value' | 'format'
        > {
    format?: string
    /** ISO date-time an empty picker opens on, unless `referenceDate` is set. */
    initialFocusedDate?: string | null
}

export const OFDateTimePicker = ({
    field,
    form,
    format,
    initialFocusedDate,
    ...other
}: OFDateTimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [closeTime, setCloseTime] = useState<number | null>(null)
    const currentError = form.errors[field.name]

    const maybeOpenPicker = () => {
        // setTouched would replace the touched state of the other fields
        form.setFieldTouched(field.name, true)
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
            referenceDate={toReferenceDate(initialFocusedDate)}
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
