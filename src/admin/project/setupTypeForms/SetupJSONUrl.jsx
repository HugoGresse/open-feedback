import React, {useState} from 'react'
import Grid from '@mui/material/Grid'
import SetupJSONUrlForm from './SetupJSONUrlForm.jsx'
import {Typography} from '@mui/material'
import SetupValidationContainer from './validation/SetupValidationContainer.jsx'
import {PROJECT_TYPE_JSONURL} from '../../../core/setupType/projectApi.js'
import JsonUrlApi from '../../../core/setupType/jsonurl/JsonUrlApi.js'

const SetupJSONUrl = ({
                       submitText,
                       leftColumnTitle,
                       rightColumnTitle,
                       onSubmit,
                       initialValues,
                       backText,
                       onBack
                   }) => {
    const [formChangeValues, onFormChange] = useState(null)

    const formValues = formChangeValues || initialValues
    const isFieldNotEmpty = formValues && formValues.jsonUrl

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Typography variant="h5">
                    {leftColumnTitle}
                </Typography>
                <SetupJSONUrlForm
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
            {isFieldNotEmpty && <Grid item xs={12} sm={6}>
                <Typography variant="h5" gutterBottom>
                    {rightColumnTitle}
                </Typography>
                <SetupValidationContainer setupType={PROJECT_TYPE_JSONURL}
                                          api={new JsonUrlApi(formValues)}/>
            </Grid>}
        </Grid>
    )
}

export default SetupJSONUrl
