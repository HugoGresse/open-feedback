import { useEffect } from 'react'
import Collapse from '@mui/material/Collapse'
import { OFFormControl } from '../../../baseComponents/form/formControl/OFFormControl.tsx'
import { Field, useField } from 'formik'
import { OFDateTimePicker } from '../../../baseComponents/form/dateTimePicker/OFDateTimePicker.tsx'
import { useTranslation } from 'react-i18next'
import type { DateTime } from 'luxon'

const fieldNameVoteStartTime = 'voteStartTime'
const fieldNameVoteEndTime = 'voteEndTime'

interface RestrictVoteRangeFieldsProps {
    isOpen: boolean
}

export const RestrictVoteRangeFields = ({
    isOpen,
}: RestrictVoteRangeFieldsProps) => {
    const { t } = useTranslation()

    const [startField, startMeta] = useField<DateTime>(fieldNameVoteStartTime)
    const [endField, endMeta, endHelpers] =
        useField<DateTime>(fieldNameVoteEndTime)

    useEffect(() => {
        if (
            startField.value.toMillis() !==
                startMeta.initialValue?.toMillis() &&
            !endMeta.touched &&
            startField.value.toMillis() !== endField.value.toMillis()
        ) {
            endHelpers.setValue(startField.value)
        }
    }, [
        startField.value,
        startMeta.initialValue,
        endField.value,
        endHelpers,
        endMeta.touched,
    ])

    return (
        <Collapse in={isOpen}>
            <div>
                <OFFormControl
                    name={t('settingsEvent.fieldVoteOpen')}
                    fieldName="voteStartTime"
                >
                    <Field
                        name="voteStartTime"
                        format="cccc d, t"
                        component={OFDateTimePicker}
                    />
                </OFFormControl>

                <OFFormControl
                    name={t('settingsEvent.fieldVoteClose')}
                    fieldName="voteEndTime"
                >
                    <Field
                        name="voteEndTime"
                        format="cccc d, t"
                        component={OFDateTimePicker}
                    />
                </OFFormControl>
            </div>
        </Collapse>
    )
}
