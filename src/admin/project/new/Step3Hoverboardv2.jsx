import React from 'react'
import NewProjectLayout from './NewProjectLayout.jsx'
import SetupHoverboardv2 from '../setupTypeForms/SetupHoverboardv2.jsx'
import { useTranslation } from 'react-i18next'

const Step3Hoverboardv2 = ({
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
            title={t('newEvent.step3.firebaseCredentials')}
            onCancel={onCancel}>
            <SetupHoverboardv2
                initialValues={initialValues}
                onBack={onBack}
                submitText={submitText}
                backText={backText}
                rightColumnTitle={rightColumnTitle}
                onSubmit={values =>
                    onSubmit({
                        apiKey: values.apiKey,
                        projectId: values.projectId,
                        databaseURL: values.databaseURL,
                    })
                }
            />
        </NewProjectLayout>
    )
}

export default Step3Hoverboardv2
