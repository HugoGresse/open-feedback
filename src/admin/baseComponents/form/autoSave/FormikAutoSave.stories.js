import React from 'react'
import { Form, Formik } from 'formik'
import FormikAutoSave from './FormikAutoSave'
import { object, string } from 'yup'
import { CircularProgress } from '@material-ui/core'
import OFFormControlInputFormiked from '../formControl/OFFormControlInputFormiked'

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
        onSubmit={(values) => console.log('TODO', values)}>
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
                        return Promise.resolve()
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
