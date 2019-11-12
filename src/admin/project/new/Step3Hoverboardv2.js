import React from 'react'
import NewProjectLayout from './NewProjectLayout'
import SetupHoverboardv2 from '../setupTypeForms/SetupHoverboardv2'

const Step3Hoverboardv2 = ({
                               onCancel,
                               onBack,
                               onSubmit,
                               stepTitle,
                               submitText,
                               backText,
                               initialValues,
                               rightColumnTitle
                           }) => {
    return (
        <NewProjectLayout
            stepTitle={stepTitle}
            title="Enter your Firebase credentials"
            onCancel={onCancel}
        >
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
                        databaseURL: values.databaseURL
                    })
                }
            />
        </NewProjectLayout>
    )
}

export default Step3Hoverboardv2
