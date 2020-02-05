import OFFormControl from './OFFormControl'
import React from 'react'
import { Field, Formik } from 'formik'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { OFSwitch } from '../switch/OFSwitch'
import OFFormControlInputFormiked from './OFFormControlInputFormiked'
import OFAutoComplete from '../autocomplete2/OFAutoComplete'

export default {
    component: OFFormControl,
    title: 'Admin|FormControl',
}

export const defaultUsage = () => (
    <Formik
        initialValues={{
            restrictVoteRange: false,
        }}>
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

export const withInput = () => (
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
)

export const withOtherComponents = () => (
    <Formik
        initialValues={{
            voteStartTime: '',
        }}>
        <OFFormControl name="An AutoComplete" fieldName="autoComplete">
            <Field
                name="autoComplete"
                dataArray={['item1', 'item2']}
                component={OFAutoComplete}
            />
        </OFFormControl>
    </Formik>
)

export const withAnError = () => (
    <Formik
        initialValues={{
            autoComplete: 'some not valid value',
        }}
        initialTouched={{ autoComplete: true }}
        initialErrors={{
            autoComplete: 'This is a dumb error',
        }}>
        <OFFormControlInputFormiked
            name="An input with error"
            fieldName="autoComplete"
        />
    </Formik>
)
