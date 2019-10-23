import React from 'react'
import NewProjectLayout from './NewProjectLayout'
import {object, string} from 'yup'
import {Typography} from '@material-ui/core'
import {Field, Form, Formik} from 'formik'
import OFButton from '../../baseComponents/OFButton'
import RadioButtonGroup from './RadioButtonGroup'
import OFRadioButtonFormiked from './OFRadioButtonFormiked'

const schema = object().shape({
    projectType: string().required(
        <Typography>You need to choose how you want to setup the project.</Typography>
    )
})

const Step2 = ({onCancel, onSubmit}) => {
    return <NewProjectLayout
        stepTitle="Create a new event (step 2/3)"
        title="How do you want to load your data?"
        onCancel={onCancel}>

        <Formik
            validationSchema={schema}
            initialValues={{projectType: ''}}
            onSubmit={(values, actions) => onSubmit(values.projectType)}
        >

            {({isSubmitting}) => (
                <Form method="POST">
                    <RadioButtonGroup fieldName="projectType">

                        <Field
                            component={OFRadioButtonFormiked}
                            name="projectType"
                            id="hoverboardv2"
                            label={<div>
                                <Typography variant="h6">Hoverboard v2 Firestore</Typography>
                                <Typography variant="subtitle1">The talks/speakers/schedule will be retrieved directly
                                    on page load from your own
                                    Firestore database that follow Hoverboard v2 model.</Typography>
                            </div>}
                        />

                        <Field
                            component={OFRadioButtonFormiked}
                            name="projectType"
                            id="json"
                            label={<div>
                                <Typography variant="h6">Link to JSON file</Typography>
                                <Typography variant="subtitle1">By providing a url to a .json file that you’ll either
                                    host (on gist.github.com or another static server) or a dynamic answer from your
                                    own database/api. The json model will need to match OpenFeedback one, you’ll be able
                                    to check it on the next screen.</Typography>
                            </div>}
                        />
                        <Field
                            component={OFRadioButtonFormiked}
                            name="projectType"
                            id="openfeedback"
                            disabled
                            label={
                                <div>
                                    <Typography variant="h6">OpenFeedback Database (not available yet)</Typography>
                                    <Typography variant="subtitle1">You can manually enter the talks/speakers/schedule
                                        on OpenFeedback. It will not be in sync with another service if you are using
                                        one. No additional configuration is required.</Typography>
                                </div>
                            }
                        />
                    </RadioButtonGroup>

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
