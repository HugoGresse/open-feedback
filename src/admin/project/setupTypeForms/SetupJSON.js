import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import SetupJSONForm from './SetupJSONForm'
import {Typography} from '@material-ui/core'
import SetupValidationContainer from './validation/SetupValidationContainer'
import {PROJECT_TYPE_JSONURL} from '../../../core/setupType/projectApi'
import JsonUrlApi from '../../../core/setupType/jsonurl/JsonUrlApi'

const SetupJSON = ({
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

export default SetupJSON
