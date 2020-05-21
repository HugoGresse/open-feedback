import React, { useEffect } from 'react'
import OFFormControl from '../../baseComponents/form/formControl/OFFormControl'
import { Field, useField } from 'formik'
import OFDateTimePicker from '../../baseComponents/form/dateTimePicker/OFDateTimePicker'
import { useTranslation } from 'react-i18next'

const startTimeFieldName = 'startTime'
const endTimeFieldName = 'endTime'
const TalkStartEndTimeFields = ({ defaultValue }) => {
    const [startField, startMeta] = useField(startTimeFieldName)
    // eslint-disable-next-line no-unused-vars
    const [endField, endMeta, endHelpers] = useField(endTimeFieldName)

    useEffect(() => {
        // Update end time if start time is touched and updated
        if (
            startField.value !== startMeta.initialValue &&
            !endMeta.touched &&
            startField.value !== endField.value
        ) {
            endHelpers.setValue(startField.value)
        }
    }, [
        startField.value,
        endHelpers,
        startMeta.initialValue,
        endMeta,
        endField.value,
    ])

    const { t } = useTranslation()

    return (
        <>
            <OFFormControl
                name={t('talks.fieldStartTime')}
                fieldName={startTimeFieldName}>
                <Field
                    name={startTimeFieldName}
                    format="FFF"
                    initialFocusedDate={defaultValue}
                    autocomplete="off"
                    component={OFDateTimePicker}
                />
            </OFFormControl>

            <OFFormControl
                name={t('talks.fieldEndTime')}
                fieldName={endTimeFieldName}>
                <Field
                    name={endTimeFieldName}
                    format="FFF"
                    autocomplete="off"
                    component={OFDateTimePicker}
                />
            </OFFormControl>
        </>
    )
}

export default TalkStartEndTimeFields
