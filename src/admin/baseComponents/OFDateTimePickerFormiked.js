import React from 'react'
import {DateTimePicker} from '@material-ui/pickers'
import OFInputForDateTimePicker from './OFInputForDateTimePicker'

const OFDateTimePickerFormiked = ({ field, form, ...other }) => {
    const currentError = form.errors[field.name];

    return (
        <DateTimePicker
            name={field.name}
            value={field.value}
            variant="inline"
            format={field.format}
            ampm={false}
            helperText={currentError}
            error={Boolean(currentError)}
            onError={error => {
                // handle as a side effect
                if (error !== currentError) {
                    form.setFieldError(field.name, error);
                }
            }}
            TextFieldComponent={OFInputForDateTimePicker}
            onChange={date => form.setFieldValue(field.name, date, false)}
            {...other}
        />
    )
}

export default OFDateTimePickerFormiked
