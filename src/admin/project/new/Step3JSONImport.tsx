import { useTranslation } from 'react-i18next'
import { NewProjectLayout } from './NewProjectLayout.tsx'
import { SetupJSONImport } from '../setupTypeForms/SetupJSONImport'
import type { JSONImportFormValues } from '../setupTypeForms/SetupJSONImportForm'
import type { EventData } from '../../../core/setupType/eventDataNormalization'

export interface Step3JSONImportProps {
    stepTitle: string
    submitText: string
    backText: string
    rightColumnTitle: string
    onCancel: () => void
    onBack: (values: JSONImportFormValues) => void
    onSubmit: (config: { jsonData: EventData }) => void
    initialValues?: JSONImportFormValues
}

export const Step3JSONImport = ({
    stepTitle,
    submitText,
    backText,
    rightColumnTitle,
    onCancel,
    onBack,
    onSubmit,
    initialValues,
}: Step3JSONImportProps) => {
    const { t } = useTranslation()
    return (
        <NewProjectLayout
            stepTitle={stepTitle}
            title={t('newEvent.step3.jsonImport')}
            onCancel={onCancel}
        >
            <SetupJSONImport
                submitText={submitText}
                backText={backText}
                rightColumnTitle={rightColumnTitle}
                onBack={onBack}
                onSubmit={onSubmit}
                initialValues={initialValues || { jsonText: '' }}
            />
        </NewProjectLayout>
    )
}
