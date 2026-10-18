import { NewProjectLayout } from './NewProjectLayout.tsx'
import { SetupJSON } from '../setupTypeForms/SetupJSON.tsx'
import { useTranslation } from 'react-i18next'
import type { JsonUrlConfig } from '../../../core/models'

export interface Step3JSONProps {
    onCancel: () => void
    onBack: (values: JsonUrlConfig) => void
    onSubmit: (config: JsonUrlConfig) => void
    stepTitle: string
    submitText: string
    backText: string
    initialValues: JsonUrlConfig
    rightColumnTitle: string
}

export const Step3JSON = ({
    onCancel,
    onBack,
    onSubmit,
    stepTitle,
    submitText,
    backText,
    initialValues,
    rightColumnTitle,
}: Step3JSONProps) => {
    const { t } = useTranslation()
    return (
        <NewProjectLayout
            stepTitle={stepTitle}
            title={t('newEvent.step3.jsonurl')}
            onCancel={onCancel}
        >
            <SetupJSON
                initialValues={initialValues}
                onBack={onBack}
                submitText={submitText}
                backText={backText}
                rightColumnTitle={rightColumnTitle}
                onSubmit={(values) =>
                    onSubmit({
                        jsonUrl: values.jsonUrl,
                    })
                }
            />
        </NewProjectLayout>
    )
}
