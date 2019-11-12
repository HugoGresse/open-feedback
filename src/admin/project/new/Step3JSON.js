import React from 'react'
import NewProjectLayout from './NewProjectLayout'
import SetupJSON from '../setupTypeForms/SetupJSON'

const Step3JSON = ({
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
            title="Where is your JSON file?"
            onCancel={onCancel}
        >
            <SetupJSON
                initialValues={initialValues}
                onBack={onBack}
                submitText={submitText}
                backText={backText}
                rightColumnTitle={rightColumnTitle}
                onSubmit={values =>
                    onSubmit({
                        jsonUrl: values.jsonUrl
                    })
                }
            />
        </NewProjectLayout>
    )
}

export default Step3JSON
