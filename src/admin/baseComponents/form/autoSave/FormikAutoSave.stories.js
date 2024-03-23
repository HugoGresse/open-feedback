import React from 'react'
import { Form, Formik } from 'formik'
import FormikAutoSave from './FormikAutoSave.jsx'
import { object, string } from 'yup'
import { CircularProgress } from '@mui/material'
import OFFormControlInputFormiked from '../formControl/OFFormControlInputFormiked.jsx'

export default {
    component: FormikAutoSave,
    title: 'Admin/AutoSave',
}

export const defaultUsage = () => (
    <Formik
        validationSchema={object().shape({
            title: string().required(),
        })}
        initialValues={{
            title: '',
        }}
        onSubmit={() => null}
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
                    onSave={(values) => {
                        return Promise.resolve(values)
                    }}
                    render={({ isSaving, lastSaved, saveError }) => (
                        <div>
                            {isSaving ? (
                                <CircularProgress />
                            ) : saveError ? (
                                `Error: ${saveError}`
                            ) : lastSaved ? (
                                `Autosaved ${lastSaved}`
                            ) : (
                                ''
                            )}
                        </div>
                    )}
                />
            </Form>
        )}
    </Formik>
)
