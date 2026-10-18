import type { Meta } from '@storybook/react-vite'
import { Field, Formik } from 'formik'
import { OFFormControl } from '../formControl/OFFormControl.tsx'
import { OFSelect } from './OFSelect.tsx'
import MenuItem from '@mui/material/MenuItem'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const meta = {
    component: OFSelect,
    title: 'Admin/Select',
} satisfies Meta<typeof OFSelect>
export default meta

export const defaultUsage = () => (
    <ThemeProvider theme={createTheme()}>
        <Formik
            onSubmit={() => {}}
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
    </ThemeProvider>
)

export const noDefaultValue = () => (
    <ThemeProvider theme={createTheme()}>
        <Formik
            onSubmit={() => {}}
            initialValues={{
                userType: '',
            }}
        >
            <OFFormControl
                fieldName="userType"
                name="No Default value user type"
            >
                <Field name="userType" component={OFSelect}>
                    {['Owner', 'Admin', 'Member'].map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Field>
            </OFFormControl>
        </Formik>
    </ThemeProvider>
)

export const disabled = () => (
    <ThemeProvider theme={createTheme()}>
        <Formik
            onSubmit={() => {}}
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
    </ThemeProvider>
)
