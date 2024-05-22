import OFDateTimePicker from './OFDateTimePicker.jsx'
import React from 'react'
import { Field, Formik } from 'formik'
import OFFormControl from '../formControl/OFFormControl.jsx'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DateTime } from 'luxon'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default {
    component: OFDateTimePicker,
    title: 'Admin/DateTimePicker',
}

export const defaultUsage = () => (
    <Formik
        initialValues={{
            Date: new Date().toString(),
        }}
    >

        <LocalizationProvider dateAdapter={AdapterLuxon}
                              adapterLocale={DateTime.now().resolvedLocaleOptions().locale}>
            <Field name="startTime" format="FFF" component={OFDateTimePicker} />
        </LocalizationProvider>
    </Formik>
)

export const withFormControl = () => (
    <ThemeProvider theme={createTheme()}>
        <Formik
            initialValues={{
                Date: new Date().toString(),
            }}
        >

            <LocalizationProvider dateAdapter={AdapterLuxon}
                                  adapterLocale={DateTime.now().resolvedLocaleOptions().locale}>
                <OFFormControl name="Pick the date" fieldName="startTime">
                    <Field
                        name="startTime"
                        format="FFF"
                        component={OFDateTimePicker}
                    />
                </OFFormControl>
            </LocalizationProvider>
        </Formik>
    </ThemeProvider>
)
