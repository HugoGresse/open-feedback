import React, { useState } from 'react'
import { Form, Formik } from 'formik'
import { object, string } from 'yup'
import SidePanelLayout from '../../baseComponents/layouts/SidePanelLayout'
import OFButton from '../../baseComponents/OFButton'
import OFFormControlInputFormiked from '../../baseComponents/form/OFFormControlInputFormiked'

const schema = object().shape({
    name: string()
        .trim()
        .required('The speaker name is required.'),
    photoUrl: string()
        .url('The photo url is not a valid url.')
        .trim()
        .required('The speaker photo url is required.'),
    socialProfil: string()
        .notRequired()
        .url('The photo url is not a valid url.')
        .trim(),
})

const SpeakerAddEditPanel = ({ isOpen, speaker, onClose, onSubmit }) => {
    const [shouldContinueAfterSubmit, setContinueAfterSubmit] = useState(false)

    return (
        <SidePanelLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Add a new speaker to the event">
            <Formik
                validationSchema={schema}
                initialValues={
                    speaker || {
                        name: '',
                        photoUrl: '',
                        socialProfil: '',
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
                            name="Name*"
                            fieldName="name"
                            type="text"
                            isSubmitting={isSubmitting}
                        />
                        <OFFormControlInputFormiked
                            name="Photo url*"
                            fieldName="photoUrl"
                            type="url"
                            isSubmitting={isSubmitting}
                        />
                        <OFFormControlInputFormiked
                            name="Social profil page"
                            fieldName="socialProfil"
                            type="url"
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
                            {speaker ? 'Save' : 'Add speaker'}
                        </OFButton>
                        {!speaker && (
                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                variant="outlined"
                                style={{
                                    design: 'text',
                                    marginTop: 12,
                                    width: '100%',
                                }}
                                onClick={() => setContinueAfterSubmit(true)}>
                                Add speaker & continue
                            </OFButton>
                        )}
                    </Form>
                )}
            </Formik>
        </SidePanelLayout>
    )
}

export default SpeakerAddEditPanel
