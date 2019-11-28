import React from 'react'
import { Form, Formik } from 'formik'
import { object, string } from 'yup'
import SidePanelLayout from '../../baseComponents/layouts/SidePanelLayout'
import OFButton from '../../baseComponents/OFButton'
import OFFormControlInputFormiked from '../../baseComponents/OFFormControlInputFormiked'

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

const SpeakerAddEditPanel = ({ isOpen, onClose, onSubmit }) => {
    return (
        <SidePanelLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Add a new speaker to the event">
            <Formik
                validationSchema={schema}
                initialValues={{
                    name: '',
                    photoUrl: '',
                    socialProfil: '',
                }}
                onSubmit={(values, actions) => {
                    onSubmit(values.email)
                    console.log(actions)
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
                            }}>
                            Add speaker
                        </OFButton>
                        <OFButton
                            disabled={isSubmitting}
                            type="submit"
                            variant="outlined"
                            style={{
                                design: 'text',
                                marginTop: 12,
                                width: '100%',
                            }}>
                            Add speaker & continue
                        </OFButton>
                    </Form>
                )}
            </Formik>
        </SidePanelLayout>
    )
}

export default SpeakerAddEditPanel
