import OFInput from './OFInput.jsx'
import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Formik } from 'formik'
import OFFormControlInputFormiked from '../formControl/OFFormControlInputFormiked.jsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default {
    component: OFInput,
    title: 'Admin/Input',
}

export const defaultUsage = () => (
    <OFInput name="myField" label="Field label" placeholder="Placeholder" />
)

export const withFormControl = () => (
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

export const disabled = () => (
    <OFInput
        name="myField"
        label="Field label"
        placeholder="Placeholder"
        disabled={true}
    />
)

export const controlled = () => (
    <OFInput
        name="myField1"
        label="Field label"
        placeholder="Placeholder"
        value="value"
    />
)

export const error = () => (
    <OFInput
        name="myField1"
        label="Field label"
        placeholder="Placeholder"
        error={true}
    />
)

export const endAdornment = () => (
    <OFInput
        value="some value"
        endAdornment={
            <InputAdornment position="end">
                <IconButton aria-label="Remove current search" size="large">
                    <CloseIcon />
                </IconButton>
            </InputAdornment>
        }
    />
)

export const autoFocus = () => <OFInput autoFocus={true} />
