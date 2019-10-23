import React from 'react'
import NewProjectLayout from './NewProjectLayout'
import {object, string} from 'yup'
import {Typography} from '@material-ui/core'
import {Form, Formik} from 'formik'
import OFFormControlInputFormiked from '../../baseComponents/OFFormControlInputFormiked'
import OFButton from '../../baseComponents/OFButton'

const schema = object().shape({
    projectId: string().required(
        <Typography>The Firebase project ID is required</Typography>
    ),
    apiKey: string().required(
        <Typography>The API Key is required</Typography>
    ),
    databaseURL: string().url().required(
        <Typography>The database URL is required</Typography>
    )
})

const Step3Hoverboardv2 = ({onCancel, onSubmit, stepTitle, submitText}) => {
    const initialValues = {
        projectId: '',
        apiKey: '',
        databaseURL: ''
    }

    return <NewProjectLayout
        stepTitle={stepTitle}
        title="Enter your Firebase credentials"
        onCancel={onCancel}>
        <Formik
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={(values) => onSubmit({
                apiKey: values.apiKey,
                projectId: values.projectId,
                databaseURL: values.databaseURL
            })}
        >

            {({isSubmitting}) => (
                <Form method="POST">

                    <OFFormControlInputFormiked
                        name="Project ID"
                        fieldName="projectId"
                        type="text"
                        isSubmitting={isSubmitting}
                    />

                    <OFFormControlInputFormiked
                        name="Api Key"
                        fieldName="apiKey"
                        type="text"
                        isSubmitting={isSubmitting}
                    />

                    <OFFormControlInputFormiked
                        name="Database URL"
                        fieldName="databaseURL"
                        type="text"
                        isSubmitting={isSubmitting}
                    />

                    <OFButton disabled={isSubmitting}
                              type="submit"
                              style={{type: "big", marginTop: 64}}>
                        {submitText}
                    </OFButton>

                </Form>
            )}
        </Formik>

    </NewProjectLayout>
}

export default Step3Hoverboardv2
