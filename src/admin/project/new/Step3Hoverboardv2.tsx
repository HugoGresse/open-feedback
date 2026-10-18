import { NewProjectLayout } from './NewProjectLayout.tsx'
import { SetupHoverboardv2 } from '../setupTypeForms/SetupHoverboardv2.tsx'
import { useTranslation } from 'react-i18next'
import type { HoverboardV2Config } from '../../../core/models'

export interface Step3Hoverboardv2Props {
    onCancel: () => void
    onBack: (values: HoverboardV2Config) => void
    onSubmit: (config: HoverboardV2Config) => void
    stepTitle: string
    submitText: string
    backText: string
    initialValues: HoverboardV2Config
    rightColumnTitle?: string
}

export const Step3Hoverboardv2 = ({
    onCancel,
    onBack,
    onSubmit,
    stepTitle,
    submitText,
    backText,
    initialValues,
    rightColumnTitle,
}: Step3Hoverboardv2Props) => {
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
