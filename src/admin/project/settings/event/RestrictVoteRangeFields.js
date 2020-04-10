import React, { useEffect } from 'react'
import Collapse from '@material-ui/core/Collapse'
import OFFormControl from '../../../baseComponents/form/formControl/OFFormControl'
import { Field, useField } from 'formik'
import OFDateTimePicker from '../../../baseComponents/form/dateTimePicker/OFDateTimePicker'
import { useTranslation } from 'react-i18next'

const fieldNameVoteStartTime = 'voteStartTime'
const fieldNameVoteEndTime = 'voteEndTime'

const RestrictVoteRangeFields = ({ isOpen }) => {
    const { t } = useTranslation()

    const [startField, startMeta] = useField(fieldNameVoteStartTime)
    // eslint-disable-next-line no-unused-vars
    const [endField, endMeta, endHelpers] = useField(fieldNameVoteEndTime)

    useEffect(() => {
        if (startField.value !== startMeta.initialValue && !endMeta.touched) {
            endHelpers.setValue(startField.value)
        }
    }, [startField.value])

    return (
        <Collapse in={isOpen}>
            <div>
                <OFFormControl
                    name={t('settingsEvent.fieldVoteOpen')}
                    fieldName="voteStartTime">
                    <Field
                        name="voteStartTime"
                        format="FFF"
                        component={OFDateTimePicker}
                    />
                </OFFormControl>

                <OFFormControl
                    name={t('settingsEvent.fieldVoteClose')}
                    fieldName="voteEndTime">
                    <Field
                        name="voteEndTime"
                        format="FFF"
                        component={OFDateTimePicker}
                    />
                </OFFormControl>
            </div>
        </Collapse>
    )
}

export default RestrictVoteRangeFields
