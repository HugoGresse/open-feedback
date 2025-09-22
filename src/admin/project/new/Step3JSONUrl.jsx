import React from 'react'
import NewProjectLayout from './NewProjectLayout.jsx'
import SetupJSON from '../setupTypeForms/SetupJSON.jsx'
import { useTranslation } from 'react-i18next'

const Step3JSONUrl = ({
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

export default Step3JSONUrl
