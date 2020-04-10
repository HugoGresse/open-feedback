import SidePanelLayout from '../../../baseComponents/layouts/sidepanel/SidePanelLayout'
import { Form, Formik } from 'formik'
import OFFormControlInputFormiked from '../../../baseComponents/form/formControl/OFFormControlInputFormiked'
import OFButton from '../../../baseComponents/button/OFButton'
import React from 'react'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'

const UserInvitePanel = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation()
    return (
        <SidePanelLayout
            title={t('settingsUser.add')}
            isOpen={isOpen}
            onClose={onClose}>
            <Formik
                validationSchema={object().shape({
                    email: string()
                        .email(t('settingsUser.emailNotValid'))
                        .required(t('settingsUser.emailRequired')),
                })}
                initialValues={{
                    email: '',
                }}
                onSubmit={(values) => onSubmit(values.email)}>
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <OFFormControlInputFormiked
                            name={t('settingsUser.memberEmail')}
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
                            {t('settingsUser.submit')}
                        </OFButton>
                    </Form>
                )}
            </Formik>
        </SidePanelLayout>
    )
}

export default UserInvitePanel
