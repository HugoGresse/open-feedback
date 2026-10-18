import type { Meta } from '@storybook/react-vite'
import { OFDateTimePicker } from './OFDateTimePicker.tsx'
import { Field, Formik } from 'formik'
import { OFFormControl } from '../formControl/OFFormControl.tsx'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DateTime } from 'luxon'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const meta = {
    component: OFDateTimePicker,
    title: 'Admin/DateTimePicker',
} satisfies Meta<typeof OFDateTimePicker>
export default meta

export const defaultUsage = () => (
    <Formik
        onSubmit={() => {}}
        initialValues={{
            Date: new Date().toString(),
        }}
    >
        <LocalizationProvider
            dateAdapter={AdapterLuxon}
            adapterLocale={DateTime.now().resolvedLocaleOptions().locale}
        >
            <Field name="startTime" format="FFF" component={OFDateTimePicker} />
        </LocalizationProvider>
    </Formik>
)

export const withFormControl = () => (
    <ThemeProvider theme={createTheme()}>
        <Formik
            onSubmit={() => {}}
            initialValues={{
                Date: new Date().toString(),
            }}
        >
            <LocalizationProvider
                dateAdapter={AdapterLuxon}
                adapterLocale={DateTime.now().resolvedLocaleOptions().locale}
            >
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
