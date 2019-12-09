import React from 'react'
import { object, string } from 'yup'
import { Form, Formik } from 'formik'
import OFFormControlInputFormiked from '../../baseComponents/form/OFFormControlInputFormiked'
import OFButton from '../../baseComponents/OFButton'
import Box from '@material-ui/core/Box'
import { FormikObserver } from '../../baseComponents/form/FormikObserver'

const schema = object().shape({
    projectId: string().required('The Firebase project ID is required'),
    apiKey: string().required('The API Key is required'),
    databaseURL: string()
        .url('The database URL must be a valid url')
        .required('The database URL is required'),
})

const SetupHoverboardv2Form = ({
    onBack,
    onSubmit,
    submitText,
    backText,
    initialValues,
    onFormChange,
}) => {
    return (
        <Formik
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={values =>
                onSubmit({
                    apiKey: values.apiKey,
                    projectId: values.projectId,
                    databaseURL: values.databaseURL,
                })
            }>
            {({ isSubmitting, values }) => (
                <Form method="POST">
                    {onFormChange && (
                        <FormikObserver
                            value={values}
                            onChange={values => onFormChange(values)}
                        />
                    )}
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

                    <Box justifyContent="space-between" display="flex">
                        {backText && (
                            <OFButton
                                disabled={isSubmitting}
                                onClick={() => onBack(values)}
                                style={{
                                    type: 'big',
                                    design: 'text',
                                    marginTop: 64,
                                }}>
                                {backText}
                            </OFButton>
                        )}

                        {submitText && (
                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                style={{ type: 'big', marginTop: 64 }}>
                                {submitText}
                            </OFButton>
                        )}
                    </Box>
                </Form>
            )}
        </Formik>
    )
}

export default SetupHoverboardv2Form
