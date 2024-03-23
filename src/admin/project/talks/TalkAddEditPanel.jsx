import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { object, string, array } from 'yup'
import SidePanelLayout from '../../baseComponents/layouts/sidepanel/SidePanelLayout.jsx'
import OFButton from '../../baseComponents/button/OFButton.jsx'
import OFFormControl from '../../baseComponents/form/formControl/OFFormControl.jsx'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import LuxonUtils from '@date-io/luxon'
import OFAutoComplete from '../../baseComponents/form/autoComplete/OFAutoComplete.jsx'
import OFFormControlInputFormiked from '../../baseComponents/form/formControl/OFFormControlInputFormiked.jsx'
import SpeakerAddEditPanel from '../speakers/SpeakerAddEditPanel.jsx'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import TalkStartEndTimeFields from './TalkStartEndTimeFields.jsx'

const TalkAddEditPanel = ({
    isOpen,
    talk,
    projectVoteStartTime,
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
                            trackTitle: string().ensure(),
                            tags: array().of(string()),
                            startTime: string().nullable().trim(),
                            endTime: string().nullable().trim(),
                            speakers: array().of(object()),
                        })}
                        initialValues={
                            talk || {
                                title: '',
                                trackTitle: '',
                                tags: [],
                                startTime: null,
                                endTime: null,
                                speakers: [],
                            }
                        }
                        onSubmit={(values, { resetForm }) => {
                            // this is a fix until yup ensure() actually change the output, see https://github.com/jaredpalmer/formik/issues/473
                            values.trackTitle = values.trackTitle
                                ? values.trackTitle
                                : ''
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
                                    autoFocus={true}
                                />

                                <TalkStartEndTimeFields
                                    defaultValue={
                                        projectVoteStartTime ||
                                        DateTime.local().toISO()
                                    }
                                />

                                <OFFormControl
                                    name={t('talks.fieldTrack')}
                                    fieldName="trackTitle"
                                    type="text">
                                    <Field
                                        name="trackTitle"
                                        dataArray={existingTracks}
                                        freeSolo={true}
                                        component={OFAutoComplete}
                                    />
                                </OFFormControl>

                                <OFFormControl
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
                                </OFFormControl>

                                <OFFormControl
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
                                                {t('talks.addNewSpeaker')}
                                            </OFButton>
                                        }
                                        dataArray={existingSpeakers}
                                        keyToDisplay="name"
                                        multiple={true}
                                        component={OFAutoComplete}
                                    />
                                </OFFormControl>

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
                                            (speaker) => {
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
