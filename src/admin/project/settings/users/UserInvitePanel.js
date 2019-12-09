import SidePanelLayout from '../../../baseComponents/layouts/SidePanelLayout'
import { Form, Formik } from 'formik'
import OFFormControlInputFormiked from '../../../baseComponents/form/OFFormControlInputFormiked'
import OFButton from '../../../baseComponents/OFButton'
import Drawer from '@material-ui/core/Drawer'
import React from 'react'
import { object, string } from 'yup'
import makeStyles from '@material-ui/core/styles/makeStyles'

const schema = object().shape({
    email: string()
        .email('The member email must be a valid email, you bitch!')
        .required(
            'The member email is required. You think you can invite Nobody? Well... no.'
        ),
})

const useStyles = makeStyles(theme => ({
    paper: {
        maxWidth: 300,
        padding: 36,
        [theme.breakpoints.down('xs')]: {
            padding: 18,
            width: 'calc(100% - 36px)',
        },
    },
}))

const UserInvitePanel = ({ isOpen, onClose, onSubmit }) => {
    const classes = useStyles()

    return (
        <Drawer
            anchor="right"
            classes={{
                paper: classes.paper,
            }}
            open={isOpen}
            onClose={onClose}>
            <SidePanelLayout
                title="Add a new member to the event"
                onClose={onClose}>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        email: '',
                    }}
                    onSubmit={values => onSubmit(values.email)}>
                    {({ isSubmitting }) => (
                        <Form method="POST">
                            <OFFormControlInputFormiked
                                name="Member email"
                                fieldName="email"
                                type="text"
                                isSubmitting={isSubmitting}
                            />

                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                style={{
                                    type: 'big',
                                    marginTop: 64,
                                    width: '100%',
                                }}>
                                Add member
                            </OFButton>
                        </Form>
                    )}
                </Formik>
            </SidePanelLayout>
        </Drawer>
    )
}

export default UserInvitePanel
