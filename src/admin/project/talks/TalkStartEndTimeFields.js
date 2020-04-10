import React, { useEffect } from 'react'
import OFFormControl from '../../baseComponents/form/formControl/OFFormControl'
import { Field, useField } from 'formik'
import OFDateTimePicker from '../../baseComponents/form/dateTimePicker/OFDateTimePicker'
import { useTranslation } from 'react-i18next'

const startTimeFieldName = 'startTime'
const endTimeFieldName = 'endTime'
const TalkStartEndTimeFields = () => {
    const [startField, startMeta] = useField(startTimeFieldName)
    // eslint-disable-next-line no-unused-vars
    const [endField, endMeta, endHelpers] = useField(endTimeFieldName)

    useEffect(() => {
        if (startField.value !== startMeta.initialValue && !endMeta.touched) {
            endHelpers.setValue(startField.value)
        }
    }, [startField.value, endHelpers, startMeta.initialValue, endMeta])

    const { t } = useTranslation()

    return (
        <>
            <OFFormControl
                name={t('talks.fieldStartTime')}
                fieldName={startTimeFieldName}>
                <Field
                    name={startTimeFieldName}
                    format="FFF"
                    component={OFDateTimePicker}
                />
            </OFFormControl>

            <OFFormControl
                name={t('talks.fieldEndTime')}
                fieldName={endTimeFieldName}>
                <Field
                    name={endTimeFieldName}
                    format="FFF"
                    component={OFDateTimePicker}
                />
            </OFFormControl>
        </>
    )
}

export default TalkStartEndTimeFields
