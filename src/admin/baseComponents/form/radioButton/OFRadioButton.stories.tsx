import type { Meta } from '@storybook/react-vite'
import { OFRadioButton } from './OFRadioButton.tsx'
import Typography from '@mui/material/Typography'
import { RadioButtonGroup } from './RadioButtonGroup.tsx'
import { Field, Formik } from 'formik'

const meta = {
    component: OFRadioButton,
    title: 'Admin/RadioButton',
} satisfies Meta<typeof OFRadioButton>
export default meta

const name = 'picker'

export const defaultUsage = () => (
    <Formik
        onSubmit={() => {}}
        initialValues={{
            [name]: '',
        }}
    >
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
