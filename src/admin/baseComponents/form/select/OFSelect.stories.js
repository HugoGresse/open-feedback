import React from 'react'
import { Field, Formik } from 'formik'
import OFFormControl from '../formControl/OFFormControl.jsx'
import { OFSelect } from './OFSelect.jsx'
import MenuItem from '@mui/material/MenuItem'

export default {
    component: OFSelect,
    title: 'Admin/Select',
}

export const defaultUsage = () => (
    <Formik
        initialValues={{
            userType: 'Admin',
        }}
    >
        <OFFormControl fieldName="userType" name="User type!">
            <Field name="userType" component={OFSelect}>
                {['Owner', 'Admin', 'Member'].map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </Field>
        </OFFormControl>
    </Formik>
)

export const noDefaultValue = () => (
    <Formik
        initialValues={{
            userType: '',
        }}
    >
        <OFFormControl fieldName="userType" name="No Default value user type">
            <Field name="userType" component={OFSelect}>
                {['Owner', 'Admin', 'Member'].map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </Field>
        </OFFormControl>
    </Formik>
)

export const disabled = () => (
    <Formik
        initialValues={{
            userType: 'Admin',
        }}
    >
        <OFFormControl fieldName="userType" name="Disabled select">
            <Field name="userType" component={OFSelect} disabled={true}>
                {['Owner', 'Admin', 'Member'].map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </Field>
        </OFFormControl>
    </Formik>
)
