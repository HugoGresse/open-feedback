import React from 'react'
import NewProjectLayout from './NewProjectLayout'
import SetupJSON from '../setupTypeForms/SetupJSON'
import { useTranslation } from 'react-i18next'

const Step3JSON = ({
    onCancel,
    onBack,
    onSubmit,
    stepTitle,
    submitText,
    backText,
    initialValues,
    rightColumnTitle,
}) => {
    const { t } = useTranslation()
    return (
        <NewProjectLayout
            stepTitle={stepTitle}
            title={t('newEvent.step3.jsonurl')}
            onCancel={onCancel}>
            <SetupJSON
                initialValues={initialValues}
                onBack={onBack}
                submitText={submitText}
                backText={backText}
                rightColumnTitle={rightColumnTitle}
                onSubmit={values =>
                    onSubmit({
                        jsonUrl: values.jsonUrl,
                    })
                }
            />
        </NewProjectLayout>
    )
}

export default Step3JSON
