import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import SetupJSONForm from './SetupJSONForm'
import {Typography} from '@material-ui/core'

const SetupJSON = ({
                       submitText,
                       leftColumnTitle,
                       rightColumnTitle,
                       onSubmit,
                       initialValues,
                       backText,
                       onBack
                   }) => {
    const [currentFormValues, onFormChange] = useState(null)

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
            {currentFormValues && <Grid item xs={12} sm={6}>
                <Typography variant="h5">
                    {rightColumnTitle}
                </Typography>
            </Grid>}
        </Grid>
    )
}

export default SetupJSON
