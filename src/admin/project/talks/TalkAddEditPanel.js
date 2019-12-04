import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { object, string, array } from 'yup'
import SidePanelLayout from '../../baseComponents/layouts/SidePanelLayout'
import OFButton from '../../baseComponents/OFButton'
import OFFormControlFormiked from '../../baseComponents/form/OFFormControlFormiked'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import OFAutoComplete from '../../baseComponents/form/OFAutoComplete'
import OFFormControlInputFormiked from '../../baseComponents/form/OFFormControlInputFormiked'
import OFDateTimePickerFormiked from '../../baseComponents/form/OFDateTimePickerFormiked'
import SpeakerAddEditPanel from '../speakers/SpeakerAddEditPanel'

const schema = object().shape({
    title: string()
        .trim()
        .required('The talk title is required.'),
    trackTitle: string().trim(),
    tags: array().of(string()),
    startTime: string()
        .trim()
        .required('The start time is required.'),
    endTime: string()
        .trim()
        .required('The end time is required.'),
    speakers: array().of(string()),
})

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

    return (
        <>
            <SidePanelLayout
                isOpen={isOpen}
                onClose={onClose}
                title="Add a new talk to the event">
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Formik
                        validationSchema={schema}
                        initialValues={
                            talk || {
                                title: '',
                                trackTitle: '',
                                tags: [],
                                startTime: Date.now(),
                                endTime: Date.now(),
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
                                    name="Title*"
                                    fieldName="title"
                                    type="text"
                                    isSubmitting={isSubmitting}
                                />

                                <OFFormControlFormiked
                                    name="Start time*"
                                    fieldName="startTime">
                                    <Field
                                        name="startTime"
                                        format="Y/MM/DD HH:mm"
                                        component={OFDateTimePickerFormiked}
                                    />
                                </OFFormControlFormiked>

                                <OFFormControlFormiked
                                    name="End time*"
                                    fieldName="endTime">
                                    <Field
                                        name="endTime"
                                        format="Y/MM/DD HH:mm"
                                        component={OFDateTimePickerFormiked}
                                    />
                                </OFFormControlFormiked>

                                <OFFormControlFormiked
                                    name="Track title"
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
                                    name="Tags"
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
                                    name="Speaker(s)"
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
                                    {talk ? 'Save' : 'Add talk'}
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
                                        Add talk & continue
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
