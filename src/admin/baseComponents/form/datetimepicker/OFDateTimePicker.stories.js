import OFDateTimePicker from './OFDateTimePicker'
import React from 'react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import LuxonUtils from '@date-io/luxon'
import { Field, Form, Formik } from 'formik'
import OFFormControl from '../formcontrol/OFFormControl'

export default {
    component: OFDateTimePicker,
    title: 'Admin/Components/DateTimePicker',
}

export const defaultUsage = () => (
    <Formik
        initialValues={{
            Date: new Date().toString(),
        }}>
        <MuiPickersUtilsProvider
            utils={LuxonUtils}
            locale={navigator.language || navigator.userLanguage}>
            <Field name="startTime" format="FFF" component={OFDateTimePicker} />
        </MuiPickersUtilsProvider>
    </Formik>
)

export const withFormControl = () => (
    <Formik
        initialValues={{
            Date: new Date().toString(),
        }}>
        <MuiPickersUtilsProvider
            utils={LuxonUtils}
            locale={navigator.language || navigator.userLanguage}>
            <OFFormControl name="Pick the date" fieldName="startTime">
                <Field
                    name="startTime"
                    format="FFF"
                    component={OFDateTimePicker}
                />
            </OFFormControl>
        </MuiPickersUtilsProvider>
    </Formik>
)
