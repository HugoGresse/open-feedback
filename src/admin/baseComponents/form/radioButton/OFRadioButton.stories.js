import OFRadioButton from './OFRadioButton'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import RadioButtonGroup from './RadioButtonGroup'
import { Field, Formik } from 'formik'

export default {
    component: OFRadioButton,
    title: 'Admin|RadioButton',
}

const name = 'picker'

export const defaultUsage = () => (
    <Formik
        initialValues={{
            [name]: '',
        }}>
        <RadioButtonGroup fieldName={name}>
            <Field
                component={OFRadioButton}
                name={name}
                id="option1"
                label={
                    <div>
                        <Typography variant="h6">Option 1</Typography>
                        <Typography variant="subtitle1">detail</Typography>
                    </div>
                }
            />

            <Field
                component={OFRadioButton}
                name={name}
                id="option2"
                label={
                    <div>
                        <Typography variant="h6">Option 2</Typography>
                        <Typography variant="subtitle1">detail</Typography>
                    </div>
                }
            />

            <Field
                component={OFRadioButton}
                name={name}
                id="option3"
                disabled={true}
                label={
                    <div>
                        <Typography variant="h6">
                            Option 3 is disabled
                        </Typography>
                        <Typography variant="subtitle1">detail</Typography>
                    </div>
                }
            />
        </RadioButtonGroup>
    </Formik>
)
