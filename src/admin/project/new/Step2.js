import React from 'react'
import NewProjectLayout from './NewProjectLayout'
import {object, string} from 'yup'
import {Typography} from '@material-ui/core'
import {Form, Formik} from 'formik'
import OFFormControlInputFormiked from '../../baseComponents/OFFormControlInputFormiked'
import OFButton from '../../baseComponents/OFButton'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'

const schema = object().shape({
    name: string().required(
        <Typography>The event name is required</Typography>
    )
})

const Step2 = ({onCancel, onSubmit}) => {
    const initialValues = {
        name: '',
    }

    return <NewProjectLayout
        stepTitle="Create a new event (step 2/3)"
        title="How do you want to load your data?"
        onCancel={onCancel}>

        <RadioGroup aria-label="gender" name="gender1">
            <FormControlLabel value="hoverboardv2" control={<Radio />} label="Hoverboard v2 Firestore" />
            <FormControlLabel value="json" control={<Radio />} label="Link to JSON file" />
            <FormControlLabel value="openfeedback"
                              control={<Radio />}
                              label="OpenFeedback Database (not available yet)"
                              disabled />
        </RadioGroup>

        <Formik
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={(values, actions) => onSubmit(values.name)}
        >

            {({isSubmitting}) => (
                <Form method="POST">

                    <OFFormControlInputFormiked
                        name="Event Name"
                        fieldName="name"
                        type="text"
                        isSubmitting={isSubmitting}
                    />

                    <OFButton disabled={isSubmitting}
                              type="submit"
                              style={{type: "big", marginTop: 64}}>
                        Continue
                    </OFButton>

                </Form>
            )}
        </Formik>

    </NewProjectLayout>
}

export default Step2
