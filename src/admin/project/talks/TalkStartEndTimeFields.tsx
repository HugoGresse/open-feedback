import { useEffect } from 'react'
import { OFFormControl } from '../../baseComponents/form/formControl/OFFormControl.tsx'
import { Field, useField } from 'formik'
import { OFDateTimePicker } from '../../baseComponents/form/dateTimePicker/OFDateTimePicker.tsx'
import { useTranslation } from 'react-i18next'

const startTimeFieldName = 'startTime'
const endTimeFieldName = 'endTime'
export const TalkStartEndTimeFields = ({ defaultValue }) => {
    const [startField, startMeta] = useField(startTimeFieldName)
    // eslint-disable-next-line no-unused-vars
    const [endField, endMeta, endHelpers] = useField(endTimeFieldName)

    useEffect(() => {
        // Update end time if start time is touched and updated
        if (
            startField.value?.toMillis() !==
                startMeta.initialValue?.toMillis() &&
            !endMeta.touched &&
            startField.value?.toMillis() !== endField.value?.toMillis()
        ) {
            endHelpers.setValue(startField.value)
        }
    }, [
        startField.value,
        endHelpers,
        startMeta.initialValue,
        endMeta.touched,
        endField.value,
    ])

    const { t } = useTranslation()

    return (
        <>
            <OFFormControl
                name={t('talks.fieldStartTime')}
                fieldName={startTimeFieldName}
            >
                <Field
                    name={startTimeFieldName}
                    format="cccc d, t"
                    initialFocusedDate={defaultValue}
                    component={OFDateTimePicker}
                />
            </OFFormControl>

            <OFFormControl
                name={t('talks.fieldEndTime')}
                fieldName={endTimeFieldName}
            >
                <Field
                    name={endTimeFieldName}
                    format="cccc d, t"
                    component={OFDateTimePicker}
                />
            </OFFormControl>
        </>
    )
}
