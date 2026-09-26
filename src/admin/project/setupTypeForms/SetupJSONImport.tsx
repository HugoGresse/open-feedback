import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import SetupJSONImportForm, {
    JSONImportFormValues,
} from './SetupJSONImportForm'
// @ts-expect-error - JS module without types
import SetupValidationContainer from './validation/SetupValidationContainer.jsx'
// @ts-expect-error - JS module without types
import { PROJECT_TYPE_JSONIMPORT } from '../../../core/setupType/projectApi'
import JsonImportApi from '../../../core/setupType/jsonimport/JsonImportApi'
import {
    EventData,
    parseEventJson,
} from '../../../core/setupType/eventDataNormalization'

interface SetupJSONImportProps {
    submitText?: string
    leftColumnTitle?: string
    rightColumnTitle?: string
    onSubmit: (config: { jsonData: EventData }) => void
    initialValues: JSONImportFormValues
    backText?: string
    onBack?: (values: JSONImportFormValues) => void
}

const SetupJSONImport = ({
    submitText,
    leftColumnTitle,
    rightColumnTitle,
    onSubmit,
    initialValues,
    backText,
    onBack,
}: SetupJSONImportProps) => {
    const [formChangeValues, onFormChange] =
        useState<JSONImportFormValues | null>(null)

    const formValues = formChangeValues || initialValues
    const { data: parsedData } = parseEventJson(formValues?.jsonText || '')

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                {leftColumnTitle && (
                    <Typography variant="h5">{leftColumnTitle}</Typography>
                )}
                <SetupJSONImportForm
                    submitText={submitText}
                    backText={backText}
                    onSubmit={onSubmit}
                    onBack={onBack}
                    initialValues={initialValues}
                    onFormChange={(values) => onFormChange(values)}
                />
            </Grid>
            {parsedData && (
                <Grid item xs={12} sm={6}>
                    <Typography variant="h5" gutterBottom>
                        {rightColumnTitle}
                    </Typography>
                    <SetupValidationContainer
                        setupType={PROJECT_TYPE_JSONIMPORT}
                        api={new JsonImportApi({ jsonData: parsedData })}
                    />
                </Grid>
            )}
        </Grid>
    )
}

export default SetupJSONImport
