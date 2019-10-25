import React from 'react'
import NewProjectLayout from './NewProjectLayout'
import { object, string } from 'yup'
import { Typography } from '@material-ui/core'
import { Form, Formik } from 'formik'
import OFFormControlInputFormiked from '../../baseComponents/OFFormControlInputFormiked'
import OFButton from '../../baseComponents/OFButton'
import Box from '@material-ui/core/Box'

const schema = object().shape({
    name: string().required(<Typography>The event name is required</Typography>)
})

const Step1 = ({ onCancel, onSubmit, initialValues }) => {
    return (
        <NewProjectLayout
            stepTitle="Create a new event (step 1/3)"
            title="What's your event name?"
            onCancel={onCancel}
        >
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={values => onSubmit(values.name)}
            >
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <OFFormControlInputFormiked
                            name="Event Name"
                            fieldName="name"
                            type="text"
                            isSubmitting={isSubmitting}
                        />

                        <Box textAlign="right">
                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                style={{ type: 'big', marginTop: 64 }}
                            >
                                Continue
                            </OFButton>
                        </Box>
                    </Form>
                )}
            </Formik>
        </NewProjectLayout>
    )
}

export default Step1
