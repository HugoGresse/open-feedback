import React from 'react'
import Step3Hoverboardv2 from './Step3Hoverboardv2'
import Step3JSON from './Step3JSON'
import {
    PROJECT_TYPE_HOVERBOARDV2,
    PROJECT_TYPE_JSONURL
} from '../../../core/setupType/projectApi'

const stepTitle = 'Create a new event (step 3/3)'
const submitText = 'Create the event'
const backText = 'Back'

const Step3 = ({ onCancel, onBack, onSubmit, projectType, initialValues }) => {
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
                            databaseURL: ''
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
                    initialValues={
                        initialValues || {
                            jsonUrl: ''
                        }
                    }
                />
            )
        default:
            return 'This project type is not managed, this should not happen, either your not a good dev, or ¯\\_(ツ)_/¯'
    }
}

export default Step3
