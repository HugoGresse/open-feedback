import type { Meta } from '@storybook/react-vite'
import { OFFormControl } from '../formControl/OFFormControl.tsx'
import { Field, Formik } from 'formik'
import FormControlLabel from '@mui/material/FormControlLabel'
import { OFSwitch } from './OFSwitch.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const meta = {
    component: OFSwitch,
    title: 'Admin/Switch',
} satisfies Meta<typeof OFSwitch>
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
