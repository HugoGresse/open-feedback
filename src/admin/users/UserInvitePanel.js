import SidePanelLayout from '../baseComponents/layouts/sidepanel/SidePanelLayout'
import { Field, Form, Formik } from 'formik'
import OFFormControlInputFormiked from '../baseComponents/form/formControl/OFFormControlInputFormiked'
import OFButton from '../baseComponents/button/OFButton'
import React from 'react'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'
import { OFSelect } from '../baseComponents/form/select/OFSelect'
import OFFormControl from '../baseComponents/form/formControl/OFFormControl'
import MenuItem from '@material-ui/core/MenuItem'

const UserInvitePanel = ({ isOpen, onClose, onSubmit, userTypes }) => {
    const { t } = useTranslation()
    return (
        <SidePanelLayout
            title={t('users.add')}
            isOpen={isOpen}
            onClose={onClose}>
            <Formik
                validationSchema={object().shape({
                    email: string()
                        .email(t('users.emailNotValid'))
                        .required(t('users.emailRequired')),
                    userType: string(t('users.typeNotValid')).required(
                        t('users.typeRequired')
                    ),
                })}
                initialValues={{
                    email: '',
                    userType: userTypes[0],
                }}
                onSubmit={(values) => onSubmit(values.email, values.userType)}>
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <OFFormControlInputFormiked
                            name={t('users.memberEmail')}
                            fieldName="email"
                            type="text"
                            isSubmitting={isSubmitting}
                            autoFocus={true}
                        />

                        {userTypes.length > 1 && (
                            <OFFormControl
                                fieldName="userType"
                                name={t('users.userType')}>
                                <Field name="userType" component={OFSelect}>
                                    {userTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </OFFormControl>
                        )}

                        <OFButton
                            disabled={isSubmitting}
                            type="submit"
                            style={{
                                type: 'big',
                                marginTop: 64,
                                width: '100%',
                            }}>
                            {t('users.submit')}
                        </OFButton>
                    </Form>
                )}
            </Formik>
        </SidePanelLayout>
    )
}

export default UserInvitePanel
