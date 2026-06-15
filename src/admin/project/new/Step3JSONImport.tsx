import React from 'react'
import { useTranslation } from 'react-i18next'
// @ts-expect-error - JS module without types
import NewProjectLayout from './NewProjectLayout.jsx'
import SetupJSONImport from '../setupTypeForms/SetupJSONImport'
import { JSONImportFormValues } from '../setupTypeForms/SetupJSONImportForm'
import { EventData } from '../../../core/setupType/eventDataNormalization'

interface Step3JSONImportProps {
    stepTitle: string
    submitText: string
    backText: string
    rightColumnTitle: string
    onCancel: () => void
    onBack: (values: JSONImportFormValues) => void
    onSubmit: (config: { jsonData: EventData }) => void
    initialValues?: JSONImportFormValues
}

const Step3JSONImport = ({
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
            onCancel={onCancel}>
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

export default Step3JSONImport
