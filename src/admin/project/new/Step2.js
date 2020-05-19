import React from 'react'
import NewProjectLayout from './NewProjectLayout'
import { object, string } from 'yup'
import { Field, Form, Formik } from 'formik'
import OFButton from '../../baseComponents/button/OFButton'
import RadioButtonGroup from '../../baseComponents/form/radioButton/RadioButtonGroup'
import OFRadioButton from '../../baseComponents/form/radioButton/OFRadioButton'
import {
    PROJECT_TYPE_HOVERBOARDV2,
    PROJECT_TYPE_JSONURL,
    PROJECT_TYPE_OPENFEEDBACK,
} from '../../../core/setupType/projectApi'
import Box from '@material-ui/core/Box'
import { useTranslation } from 'react-i18next'
import TranslatedTypography from '../../baseComponents/TranslatedTypography'

const Step2 = ({ onCancel, onBack, onSubmit, initialValues }) => {
    const { t } = useTranslation()

    const isLastStep = (projectType) =>
        projectType === PROJECT_TYPE_OPENFEEDBACK

    return (
        <Formik
            validationSchema={object().shape({
                projectType: string().required(
                    t('newEvent.step2.projectTypeRequired')
                ),
            })}
            initialValues={initialValues}
            onSubmit={(values) => onSubmit(values.projectType)}>
            {({ isSubmitting, values }) => (
                <NewProjectLayout
                    stepTitle={t(
                        isLastStep(values.projectType)
                            ? 'newEvent.step2.stepTitleDone'
                            : 'newEvent.step2.stepTitle'
                    )}
                    title={t('newEvent.step2.title')}
                    onCancel={onCancel}>
                    <Form method="POST">
                        <RadioButtonGroup fieldName="projectType">
                            <Field
                                component={OFRadioButton}
                                name="projectType"
                                id={PROJECT_TYPE_OPENFEEDBACK}
                                label={
                                    <div>
                                        <TranslatedTypography
                                            i18nKey="newEvent.step2.projectTypeOpenfeedback"
                                            variant="h6">
                                            title
                                        </TranslatedTypography>
                                        <TranslatedTypography
                                            i18nKey="newEvent.step2.projectTypeOpenfeedbackDetail"
                                            variant="subtitle1">
                                            detail
                                        </TranslatedTypography>
                                    </div>
                                }
                            />
                            <Field
                                component={OFRadioButton}
                                name="projectType"
                                id={PROJECT_TYPE_HOVERBOARDV2}
                                label={
                                    <div>
                                        <TranslatedTypography
                                            i18nKey="newEvent.step2.projectTypeHoverboard"
                                            variant="h6">
                                            title
                                        </TranslatedTypography>
                                        <TranslatedTypography
                                            i18nKey="newEvent.step2.projectTypeHoverboardDetail"
                                            variant="subtitle1">
                                            detail
                                        </TranslatedTypography>
                                    </div>
                                }
                            />

                            <Field
                                component={OFRadioButton}
                                name="projectType"
                                id={PROJECT_TYPE_JSONURL}
                                label={
                                    <div>
                                        <TranslatedTypography
                                            i18nKey="newEvent.step2.projectTypeJsonurl"
                                            variant="h6">
                                            title
                                        </TranslatedTypography>
                                        <TranslatedTypography
                                            i18nKey="newEvent.step2.projectTypeJsonurlDetail"
                                            variant="subtitle1">
                                            detail
                                        </TranslatedTypography>
                                    </div>
                                }
                            />
                        </RadioButtonGroup>

                        <Box justifyContent="space-between" display="flex">
                            <OFButton
                                disabled={isSubmitting}
                                onClick={() => onBack()}
                                style={{
                                    type: 'big',
                                    design: 'text',
                                    marginTop: 64,
                                }}>
                                {t('newEvent.step2.back')}
                            </OFButton>

                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                style={{ type: 'big', marginTop: 64 }}>
                                {isLastStep(values.projectType)
                                    ? t('newEvent.step2.create')
                                    : t('newEvent.step2.continue')}
                            </OFButton>
                        </Box>
                    </Form>
                </NewProjectLayout>
            )}
        </Formik>
    )
}
export default Step2
