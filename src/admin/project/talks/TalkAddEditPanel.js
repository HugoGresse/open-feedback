import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { object, string, array } from 'yup'
import SidePanelLayout from '../../baseComponents/layouts/SidePanelLayout'
import OFButton from '../../baseComponents/OFButton'
import OFFormControlInputFormiked from '../../baseComponents/OFFormControlInputFormiked'
import OFFormControlFormiked from '../../baseComponents/OFFormControlFormiked'
import OFDateTimePickerFormiked from '../../baseComponents/OFDateTimePickerFormiked'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

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
    onClose,
    onSubmit,
}) => {
    const [shouldContinueAfterSubmit, setContinueAfterSubmit] = useState(false)

    return (
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
                    {({ isSubmitting }) => (
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

                            <OFFormControlInputFormiked
                                name="Track title"
                                fieldName="trackTitle"
                                type="text"
                                isSubmitting={isSubmitting}
                            />
                            <OFFormControlInputFormiked
                                name="Tags"
                                fieldName="tags"
                                type="text"
                                isSubmitting={isSubmitting}
                            />
                            <OFFormControlInputFormiked
                                name="Speakers"
                                fieldName="speakers"
                                type="text"
                                isSubmitting={isSubmitting}
                            />

                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                style={{
                                    type: 'big',
                                    marginTop: 64,
                                    width: '100%',
                                }}
                                onClick={() => setContinueAfterSubmit(false)}>
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
                        </Form>
                    )}
                </Formik>
            </MuiPickersUtilsProvider>
        </SidePanelLayout>
    )
}

export default TalkAddEditPanel
