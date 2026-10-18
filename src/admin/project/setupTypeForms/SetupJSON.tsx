import { useState } from 'react'
import type { JsonUrlConfig } from '../../../core/models'
import Grid from '@mui/material/Grid'
import { SetupJSONForm } from './SetupJSONForm.tsx'
import { Typography } from '@mui/material'
import { SetupValidationContainer } from './validation/SetupValidationContainer.tsx'
import { PROJECT_TYPE_JSONURL } from '../../../core/setupType/projectApi'
import { JsonUrlApi } from '../../../core/setupType/jsonurl/JsonUrlApi'

export interface SetupJSONProps {
    submitText?: string
    leftColumnTitle?: string
    rightColumnTitle?: string
    onSubmit: (config: JsonUrlConfig) => void
    initialValues: JsonUrlConfig
    backText?: string
    onBack?: (values: JsonUrlConfig) => void
}

export const SetupJSON = ({
    submitText,
    leftColumnTitle,
    rightColumnTitle,
    onSubmit,
    initialValues,
    backText,
    onBack,
}: SetupJSONProps) => {
    const [formChangeValues, onFormChange] = useState<JsonUrlConfig | null>(
        null
    )

    const formValues = formChangeValues || initialValues
    const isFieldNotEmpty = formValues && formValues.jsonUrl

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Typography variant="h5">{leftColumnTitle}</Typography>
                <SetupJSONForm
                    submitText={submitText}
                    backText={backText}
                    onSubmit={onSubmit}
                    onBack={onBack}
                    initialValues={initialValues}
                    onFormChange={(values) => {
                        onFormChange(values)
                    }}
                />
            </Grid>
            {isFieldNotEmpty && (
                <Grid item xs={12} sm={6}>
                    <Typography variant="h5" gutterBottom>
                        {rightColumnTitle}
                    </Typography>
                    <SetupValidationContainer
                        setupType={PROJECT_TYPE_JSONURL}
                        api={new JsonUrlApi(formValues)}
                    />
                </Grid>
            )}
        </Grid>
    )
}
