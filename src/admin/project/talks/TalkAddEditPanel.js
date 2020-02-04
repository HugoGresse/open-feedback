import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { object, string, array } from 'yup'
import SidePanelLayout from '../../baseComponents/layouts/SidePanelLayout'
import OFButton from '../../baseComponents/OFButton'
import OFFormControlFormiked from '../../baseComponents/form/formik/OFFormControlFormiked'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import LuxonUtils from '@date-io/luxon'
import OFAutoComplete from '../../baseComponents/form/OFAutoComplete'
import OFFormControlInputFormiked from '../../baseComponents/form/formik/OFFormControlInputFormiked'
import OFDateTimePickerFormiked from '../../baseComponents/form/formik/OFDateTimePickerFormiked'
import SpeakerAddEditPanel from '../speakers/SpeakerAddEditPanel'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

const TalkAddEditPanel = ({
    isOpen,
    talk,
    existingSpeakers,
    existingTags,
    existingTracks,
    onClose,
    onSubmit,
    onSpeakerAdd,
}) => {
    const [shouldContinueAfterSubmit, setContinueAfterSubmit] = useState(false)
    const [addingASpeaker, setSpeakerAdd] = useState(false)
    const { t } = useTranslation()

    return (
        <>
            <SidePanelLayout
                isOpen={isOpen}
                onClose={onClose}
                title={talk ? t('talks.titleEdit') : t('talks.titleAdd')}>
                <MuiPickersUtilsProvider
                    utils={LuxonUtils}
                    locale={navigator.language || navigator.userLanguage}>
                    <Formik
                        validationSchema={object().shape({
                            title: string()
                                .trim()
                                .required(t('talks.fieldTitleRequired')),
                            trackTitle: string().trim(),
                            tags: array().of(string()),
                            startTime: string()
                                .trim()
                                .required(t('talks.fieldStartTimeRequired')),
                            endTime: string()
                                .trim()
                                .required(t('talks.fieldEndTimeRequired')),
                            speakers: array().of(string()),
                        })}
                        initialValues={
                            talk || {
                                title: '',
                                trackTitle: '',
                                tags: [],
                                startTime: DateTime.local().toISO(),
                                endTime: DateTime.local().toISO(),
                                speakers: [],
                            }
                        }
                        onSubmit={(values, { resetForm }) => {
                            if (shouldContinueAfterSubmit) {
                                resetForm()
                            }
                            return onSubmit(values, shouldContinueAfterSubmit)
                        }}>
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form method="POST">
                                <OFFormControlInputFormiked
                                    name={t('talks.fieldTitle')}
                                    fieldName="title"
                                    type="text"
                                    isSubmitting={isSubmitting}
                                />

                                <OFFormControlFormiked
                                    name={t('talks.fieldStartTime')}
                                    fieldName="startTime">
                                    <Field
                                        name="startTime"
                                        format="FFF"
                                        component={OFDateTimePickerFormiked}
                                    />
                                </OFFormControlFormiked>

                                <OFFormControlFormiked
                                    name={t('talks.fieldEndTime')}
                                    fieldName="endTime">
                                    <Field
                                        name="endTime"
                                        format="FFF"
                                        component={OFDateTimePickerFormiked}
                                    />
                                </OFFormControlFormiked>

                                <OFFormControlFormiked
                                    name={t('talks.fieldTrack')}
                                    fieldName="trackTitle"
                                    type="text">
                                    <Field
                                        name="trackTitle"
                                        dataArray={existingTracks}
                                        freeSolo={true}
                                        component={OFAutoComplete}
                                    />
                                </OFFormControlFormiked>

                                <OFFormControlFormiked
                                    name={t('talks.fieldTags')}
                                    fieldName="tags"
                                    type="text">
                                    <Field
                                        name="tags"
                                        dataArray={existingTags}
                                        freeSolo={true}
                                        multiple={true}
                                        component={OFAutoComplete}
                                    />
                                </OFFormControlFormiked>

                                <OFFormControlFormiked
                                    name={t('talks.fieldSpeakers')}
                                    fieldName="speakers"
                                    type="text">
                                    <Field
                                        name="speakers"
                                        noOptionsText={
                                            <OFButton
                                                onMouseDown={() =>
                                                    setSpeakerAdd(true)
                                                }>
                                                Add a speaker
                                            </OFButton>
                                        }
                                        dataArray={existingSpeakers}
                                        value={values.speakers}
                                        keyToDisplay="name"
                                        multiple={true}
                                        component={OFAutoComplete}
                                    />
                                </OFFormControlFormiked>

                                <OFButton
                                    disabled={isSubmitting}
                                    type="submit"
                                    style={{
                                        type: 'big',
                                        marginTop: 64,
                                        width: '100%',
                                    }}
                                    onClick={() =>
                                        setContinueAfterSubmit(false)
                                    }>
                                    {talk
                                        ? t('common.save')
                                        : t('talks.submit')}
                                </OFButton>
                                {!talk && (
                                    <OFButton
                                        disabled={isSubmitting}
                                        type="submit"
                                        variant="outlined"
                                        style={{
                                            design: 'text',
                                            marginTop: 12,
                                            width: '100%',
                                        }}
                                        onClick={() =>
                                            setContinueAfterSubmit(true)
                                        }>
                                        {t('talks.submitContinue')}
                                    </OFButton>
                                )}

                                <SpeakerAddEditPanel
                                    isOpen={addingASpeaker}
                                    onClose={() => setSpeakerAdd(false)}
                                    onSubmit={(
                                        speaker,
                                        shouldContinueAfterSubmit
                                    ) => {
                                        return onSpeakerAdd(speaker).then(
                                            speaker => {
                                                if (
                                                    !shouldContinueAfterSubmit
                                                ) {
                                                    setSpeakerAdd(false)
                                                }
                                                setFieldValue('speakers', [
                                                    ...values.speakers,
                                                    speaker,
                                                ])
                                                document.activeElement.blur()
                                            }
                                        )
                                    }}
                                />
                            </Form>
                        )}
                    </Formik>
                </MuiPickersUtilsProvider>
            </SidePanelLayout>
        </>
    )
}

export default TalkAddEditPanel
