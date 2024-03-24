import React, {useState} from 'react'
import Grid from '@mui/material/Grid'
import {Typography} from '@mui/material'
import SetupHoverboardv2Form from './SetupHoverboardv2Form.jsx'
import SetupValidationContainer from './validation/SetupValidationContainer.jsx'
import {PROJECT_TYPE_HOVERBOARDV2} from '../../../core/setupType/projectApi'
import Hoverboardv2Api from '../../../core/setupType/hoverboardv2/Hoverboardv2Api'

const SetupHoverboardv2 = ({
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
    const isFieldNotEmpty = formValues && formValues.projectId && formValues.apiKey && formValues.databaseURL

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Typography variant="h5">
                    {leftColumnTitle}
                </Typography>
                <SetupHoverboardv2Form
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
                <Typography variant="h5">
                    {rightColumnTitle}
                </Typography>
                <SetupValidationContainer setupType={PROJECT_TYPE_HOVERBOARDV2}
                                          api={new Hoverboardv2Api(formValues)}/>
            </Grid>}
        </Grid>
    )
}

export default SetupHoverboardv2
