import OFFormControl from './OFFormControl.jsx'
import React from 'react'
import { Field, Formik } from 'formik'
import FormControlLabel from '@mui/material/FormControlLabel'
import { OFSwitch } from '../switch/OFSwitch.jsx'
import OFFormControlInputFormiked from './OFFormControlInputFormiked.jsx'
import OFAutoComplete from '../autoComplete/OFAutoComplete.jsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default {
    component: OFFormControl,
    title: 'Admin/FormControl',
}

export const defaultUsage = () => (
    <ThemeProvider theme={createTheme()}>
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
    </ThemeProvider>
)

export const withInput = () => (
    <ThemeProvider theme={createTheme()}>
        <Formik
            initialValues={{
                name: '',
                nameDisabled: 'some value',
            }}
        >
            <div>
                <OFFormControlInputFormiked
                    name="This is a simple input"
                    fieldName="name"
                    type="text"
                    isSubmitting={false}
                    autoFocus={true}
                />
                <OFFormControlInputFormiked
                    name="While submitting"
                    fieldName="nameDisabled"
                    type="text"
                    isSubmitting={true}
                />
            </div>
        </Formik>
    </ThemeProvider>
)

export const withOtherComponents = () => (

    <ThemeProvider theme={createTheme()}>
        <Formik
            initialValues={{
                voteStartTime: '',
            }}
        >
            <OFFormControl name="An AutoComplete" fieldName="autoComplete">
                <Field
                    name="autoComplete"
                    dataArray={['item1', 'item2']}
                    component={OFAutoComplete}
                />
            </OFFormControl>
        </Formik>
    </ThemeProvider>
)

export const withAnError = () => (
    <ThemeProvider theme={createTheme()}>
        <Formik
            initialValues={{
                autoComplete: 'some not valid value',
            }}
            initialTouched={{ autoComplete: true }}
            initialErrors={{
                autoComplete: 'This is a dumb error',
            }}
        >
            <OFFormControlInputFormiked
                name="An input with error"
                fieldName="autoComplete"
            />
        </Formik>
    </ThemeProvider>
)
