import SidePanelLayout from '../../../baseComponents/layouts/SidePanelLayout'
import { Form, Formik } from 'formik'
import OFFormControlInputFormiked from '../../../baseComponents/form/OFFormControlInputFormiked'
import OFButton from '../../../baseComponents/OFButton'
import React from 'react'
import { object, string } from 'yup'

const schema = object().shape({
    email: string()
        .email('The member email must be a valid email, you bitch!')
        .required(
            'The member email is required. You think you can invite Nobody? Well... no.'
        ),
})

const UserInvitePanel = ({ isOpen, onClose, onSubmit }) => {
    return (
        <SidePanelLayout
            title="Add a new member to the event"
            isOpen={isOpen}
            onClose={onClose}>
            <Formik
                validationSchema={schema}
                initialValues={{
                    email: '',
                }}
                onSubmit={values => onSubmit(values.email)}>
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <OFFormControlInputFormiked
                            name="Member email"
                            fieldName="email"
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
                            }}>
                            Add member
                        </OFButton>
                    </Form>
                )}
            </Formik>
        </SidePanelLayout>
    )
}

export default UserInvitePanel
