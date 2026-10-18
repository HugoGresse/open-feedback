import type { Meta } from '@storybook/react-vite'
import { Form, Formik } from 'formik'
import { FormikAutoSave } from './FormikAutoSave.tsx'
import { object, string } from 'yup'
import { CircularProgress } from '@mui/material'
import { OFFormControlInputFormiked } from '../formControl/OFFormControlInputFormiked.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const meta = {
    component: FormikAutoSave,
    title: 'Admin/AutoSave',
} satisfies Meta<typeof FormikAutoSave>
export default meta

export const defaultUsage = () => (
    <ThemeProvider theme={createTheme()}>
        <Formik
            validationSchema={object().shape({
                title: string().required(),
            })}
            initialValues={{
                title: '',
            }}
            onSubmit={() => {}}
        >
            {({ isSubmitting }) => (
                <Form method="POST">
                    <OFFormControlInputFormiked
                        name="Example"
                        fieldName="title"
                        type="text"
                        isSubmitting={isSubmitting}
                    />

                    <FormikAutoSave
                        onSave={(values: { title: string }) => {
                            return Promise.resolve(values)
                        }}
                        render={({ isSaving, lastSavedDate, saveError }) => (
                            <div>
                                {isSaving ? (
                                    <CircularProgress />
                                ) : saveError ? (
                                    `Error: ${saveError}`
                                ) : lastSavedDate ? (
                                    `Autosaved ${lastSavedDate}`
                                ) : (
                                    ''
                                )}
                            </div>
                        )}
                    />
                </Form>
            )}
        </Formik>
    </ThemeProvider>
)
