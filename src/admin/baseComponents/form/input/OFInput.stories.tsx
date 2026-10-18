import type { Meta } from '@storybook/react-vite'
import { OFInput } from './OFInput.tsx'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Formik } from 'formik'
import { OFFormControlInputFormiked } from '../formControl/OFFormControlInputFormiked.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const meta = {
    component: OFInput,
    title: 'Admin/Input',
} satisfies Meta<typeof OFInput>
export default meta

export const defaultUsage = () => (
    <OFInput name="myField" placeholder="Placeholder" />
)

export const withFormControl = () => (
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
    <OFInput name="myField" placeholder="Placeholder" disabled={true} />
)

export const controlled = () => (
    <OFInput name="myField1" placeholder="Placeholder" value="value" />
)

export const error = () => (
    <OFInput name="myField1" placeholder="Placeholder" error={true} />
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
