import OFInput from './OFInput'
import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { Formik } from 'formik'
import OFFormControlInputFormiked from '../formControl/OFFormControlInputFormiked'

export default {
    component: OFInput,
    title: 'Admin/Input',
}

export const defaultUsage = () => (
    <OFInput name="myField" label="Field label" placeholder="Placeholder" />
)

export const withFormControl = () => (
    <Formik
        initialValues={{
            name: '',
            nameDisabled: 'some value',
        }}>
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
                <IconButton aria-label="Remove current search">
                    <CloseIcon />
                </IconButton>
            </InputAdornment>
        }
    />
)

export const autoFocus = () => <OFInput autoFocus={true} />
