import React, { useState } from 'react'
import OFInputForDateTimePicker from './OFInputForDateTimePicker.jsx'
import { useTranslation } from 'react-i18next'
import { DateTimePicker } from '@mui/x-date-pickers'

const OFDateTimePicker = ({
    field,
    form,
    format,
    initialFocusedDate,
    ...other
}) => {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [closeTime, setCloseTime] = useState(null)
    const currentError = form.errors[field.name]

    const maybeOpenPicker = () => {
        form.setTouched({ [field.name]: true })
        if(isOpen) {
            return
        }
        // Prevent the input re-focus to display the picker when the picker is just closed
        if(Date.now() - closeTime > 1000) {
            setIsOpen(true)
        }
    }

    return (
        <DateTimePicker
            open={isOpen}
            onClose={() => {
                setCloseTime(Date.now())
                setIsOpen(false)
            }}
            autoOk
            disabled={!!form.isSubmitting}
            name={field.name}
            value={field.value}
            initialFocusedDate={initialFocusedDate}
            clearable
            format={format}
            minutesStep={5}
            ampm={false}
            helperText={currentError}
            error={Boolean(currentError)}
            onError={(error) => {
                // handle as a side effect
                if (error !== currentError) {
                    form.setFieldError(field.name, error)
                }
            }}
            onBlur={field.onBlur}
            onChange={date => form.setFieldValue(field.name, date, false)}
            slots={{
                textField: OFInputForDateTimePicker,
            }}
            slotProps={{
                textField: {
                    onFocus: maybeOpenPicker,
                    onClick: maybeOpenPicker,
                },
            }}
            autoComplete="off"
            okLabel={t('common.pick')}
            cancelLabel={t('common.cancel')}
            clearLabel={t('common.clear')}
            {...other}
        />
    )
}

export default OFDateTimePicker
