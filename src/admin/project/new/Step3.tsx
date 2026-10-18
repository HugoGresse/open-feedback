import { Step3Hoverboardv2 } from './Step3Hoverboardv2.tsx'
import { Step3JSON } from './Step3JSON.tsx'
import { Step3JSONImport } from './Step3JSONImport.tsx'
import {
    PROJECT_TYPE_HOVERBOARDV2,
    PROJECT_TYPE_JSONIMPORT,
    PROJECT_TYPE_JSONURL,
} from '../../../core/setupType/projectApi'
import { useTranslation } from 'react-i18next'
import type {
    HoverboardV2Config,
    JsonUrlConfig,
    WizardSetupType,
} from '../../../core/models'
import type { JSONImportFormValues } from '../setupTypeForms/SetupJSONImportForm'
import type { EventData } from '../../../core/setupType/eventDataNormalization'

/** Values of the step 3 form, kept by the wizard when going back. */
export type Step3Values =
    | HoverboardV2Config
    | JsonUrlConfig
    | JSONImportFormValues

/** What the step 3 submits, tagged with the project type it was made for. */
export type Step3Submission =
    | {
          projectType: typeof PROJECT_TYPE_HOVERBOARDV2
          config: HoverboardV2Config
      }
    | { projectType: typeof PROJECT_TYPE_JSONURL; config: JsonUrlConfig }
    | {
          projectType: typeof PROJECT_TYPE_JSONIMPORT
          config: { jsonData: EventData }
      }

// The wizard resets the step 3 values when the project type changes, these
// guards only narrow them to the current project type.
const isHoverboardV2Values = (
    values: Step3Values
): values is HoverboardV2Config => 'apiKey' in values
const isJsonUrlValues = (values: Step3Values): values is JsonUrlConfig =>
    'jsonUrl' in values
const isJsonImportValues = (
    values: Step3Values
): values is JSONImportFormValues => 'jsonText' in values

export interface Step3Props {
    onCancel: () => void
    onBack: (values: Step3Values) => void
    onSubmit: (submission: Step3Submission) => unknown
    projectType: WizardSetupType
    initialValues?: Step3Values
}

export const Step3 = ({
    onCancel,
    onBack,
    onSubmit,
    projectType,
    initialValues,
}: Step3Props) => {
    const { t } = useTranslation()

    const stepTitle = t('newEvent.step3.stepTitle')
    const submitText = t('newEvent.step3.submit')
    const backText = t('newEvent.step3.back')
    const rightColumnTitle = t('newEvent.step3.validation')

    switch (projectType) {
        case PROJECT_TYPE_HOVERBOARDV2:
            return (
                <Step3Hoverboardv2
                    stepTitle={stepTitle}
                    submitText={submitText}
                    backText={backText}
                    onCancel={onCancel}
                    onBack={onBack}
                    onSubmit={(config) => onSubmit({ projectType, config })}
                    initialValues={
                        (initialValues &&
                            isHoverboardV2Values(initialValues) &&
                            initialValues) || {
                            projectId: '',
                            apiKey: '',
                            databaseURL: '',
                        }
                    }
                />
            )
        case PROJECT_TYPE_JSONURL:
            return (
                <Step3JSON
                    stepTitle={stepTitle}
                    submitText={submitText}
                    backText={backText}
                    onCancel={onCancel}
                    onBack={onBack}
                    onSubmit={(config) => onSubmit({ projectType, config })}
                    rightColumnTitle={rightColumnTitle}
                    initialValues={
                        (initialValues &&
                            isJsonUrlValues(initialValues) &&
                            initialValues) || {
                            jsonUrl: '',
                        }
                    }
                />
            )
        case PROJECT_TYPE_JSONIMPORT:
            return (
                <Step3JSONImport
                    stepTitle={stepTitle}
                    submitText={submitText}
                    backText={backText}
                    onCancel={onCancel}
                    onBack={onBack}
                    onSubmit={(config) => onSubmit({ projectType, config })}
                    rightColumnTitle={rightColumnTitle}
                    initialValues={
                        (initialValues &&
                            isJsonImportValues(initialValues) &&
                            initialValues) || {
                            jsonText: '',
                        }
                    }
                />
            )
        default:
            return t('newEvent.step3.notManaged')
    }
}
