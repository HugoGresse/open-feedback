import React from 'react'
import { DateTimePicker } from '@material-ui/pickers'
import OFInputForDateTimePicker from './OFInputForDateTimePicker'
import { useTranslation } from 'react-i18next'

const OFDateTimePicker = ({
    field,
    form,
    format,
    initialFocusedDate,
    ...other
}) => {
    const { t } = useTranslation()
    const currentError = form.errors[field.name]

    return (
        <DateTimePicker
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
            TextFieldComponent={OFInputForDateTimePicker}
            onChange={(date) => form.setFieldValue(field.name, date, false)}
            autoComplete="off"
            okLabel={t('common.pick')}
            cancelLabel={t('common.cancel')}
            clearLabel={t('common.clear')}
            {...other}
        />
    )
}

export default OFDateTimePicker
