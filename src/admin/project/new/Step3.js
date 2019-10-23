import React from 'react'
import Step3Hoverboardv2 from './Step3Hoverboardv2'
import Step3JSON from './Step3JSON'

const stepTitle="Create a new event (step 3/3)"
const submitText="Create the event"

const Step3 = ({onCancel, onSubmit, projectType}) => {
    projectType = "jsonUrl"
    switch(projectType) {
        case "hoverboardv2":
            return <Step3Hoverboardv2
                stepTitle={stepTitle}
                submitText={submitText}
                onCancel={onCancel}
                onSubmit={onSubmit}/>
        case "jsonUrl":
            return <Step3JSON
                stepTitle={stepTitle}
                submitText={submitText}
                onCancel={onCancel}
                onSubmit={onSubmit}/>
        default:
            return "This project type is not managed, this should not happen, either your not a good dev, or ¯\\_(ツ)_/¯"
    }
}

export default Step3
