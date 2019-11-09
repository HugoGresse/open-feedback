import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import {Typography} from '@material-ui/core'
import SetupHoverboardv2Form from './SetupHoverboardv2Form'

const Setuphoverboardv2 = ({
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
            {currentFormValues && <Grid item xs={12} sm={6}>
                <Typography variant="h5">
                    {rightColumnTitle}
                </Typography>
            </Grid>}
        </Grid>
    )
}

export default Setuphoverboardv2
