import { NewProjectLayout } from './NewProjectLayout.tsx'
import { SetupHoverboardv2 } from '../setupTypeForms/SetupHoverboardv2.tsx'
import { useTranslation } from 'react-i18next'

export const Step3Hoverboardv2 = ({
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
            onCancel={onCancel}
        >
            <SetupHoverboardv2
                initialValues={initialValues}
                onBack={onBack}
                submitText={submitText}
                backText={backText}
                rightColumnTitle={rightColumnTitle}
                onSubmit={(values) =>
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
