import React from 'react'
import NewProjectLayout from './NewProjectLayout'
import { object, string } from 'yup'
import { Form, Formik } from 'formik'
import OFFormControlInputFormiked from '../../baseComponents/form/OFFormControlInputFormiked'
import OFButton from '../../baseComponents/OFButton'
import Box from '@material-ui/core/Box'
import { useTranslation } from 'react-i18next'

const Step1 = ({ onCancel, onSubmit, initialValues }) => {
    const { t } = useTranslation()

    return (
        <NewProjectLayout
            stepTitle={t('newEvent.step1.title')}
            title={t('newEvent.step1.name')}
            onCancel={onCancel}>
            <Formik
                validationSchema={object().shape({
                    name: string().required(t('newEvent.step1.nameRequired')),
                })}
                initialValues={initialValues}
                onSubmit={values => onSubmit(values.name)}>
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <OFFormControlInputFormiked
                            name={t('newEvent.step1.fieldName')}
                            fieldName="name"
                            type="text"
                            isSubmitting={isSubmitting}
                        />

                        <Box textAlign="right">
                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                style={{ type: 'big', marginTop: 64 }}>
                                {t('newEvent.step1.submit')}
                            </OFButton>
                        </Box>
                    </Form>
                )}
            </Formik>
        </NewProjectLayout>
    )
}

export default Step1
