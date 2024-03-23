import OFFormControl from '../formControl/OFFormControl.jsx'
import React from 'react'
import { Field, Formik } from 'formik'
import FormControlLabel from '@mui/material/FormControlLabel'
import { OFSwitch } from './OFSwitch.jsx'

export default {
    component: OFSwitch,
    title: 'Admin/Switch',
}

export const defaultUsage = () => (
    <Formik
        initialValues={{
            restrictVoteRange: false,
        }}
    >
        <OFFormControl fieldName="restrictVoteRange">
            <FormControlLabel
                label="Swich label"
                control={
                    <Field name="restrictVoteRange" component={OFSwitch} />
                }
            />
        </OFFormControl>
    </Formik>
)
