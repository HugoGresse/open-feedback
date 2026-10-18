import type { Meta } from '@storybook/react-vite'
import { OFFormControl } from './OFFormControl.tsx'
import { Field, Formik } from 'formik'
import FormControlLabel from '@mui/material/FormControlLabel'
import { OFSwitch } from '../switch/OFSwitch.tsx'
import { OFFormControlInputFormiked } from './OFFormControlInputFormiked.tsx'
import { OFAutoComplete } from '../autoComplete/OFAutoComplete.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const meta = {
    component: OFFormControl,
    title: 'Admin/FormControl',
} satisfies Meta<typeof OFFormControl>
export default meta

export const defaultUsage = () => (
    <ThemeProvider theme={createTheme()}>
        <Formik
            onSubmit={() => {}}
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
            onSubmit={() => {}}
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
            onSubmit={() => {}}
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
            onSubmit={() => {}}
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
