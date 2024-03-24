import React from 'react'
import Step3Hoverboardv2 from './Step3Hoverboardv2.jsx'
import Step3JSON from './Step3JSON.jsx'
import {
    PROJECT_TYPE_HOVERBOARDV2,
    PROJECT_TYPE_JSONURL,
} from '../../../core/setupType/projectApi'
import { useTranslation } from 'react-i18next'

const Step3 = ({ onCancel, onBack, onSubmit, projectType, initialValues }) => {
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
                    onSubmit={onSubmit}
                    initialValues={
                        initialValues || {
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
                    onSubmit={onSubmit}
                    rightColumnTitle={rightColumnTitle}
                    initialValues={
                        initialValues || {
                            jsonUrl: '',
                        }
                    }
                />
            )
        default:
            return t('newEvent.step3.notManaged')
    }
}

export default Step3
