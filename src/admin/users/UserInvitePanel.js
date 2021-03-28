import SidePanelLayout from '../baseComponents/layouts/sidepanel/SidePanelLayout'
import { Field, Form, Formik } from 'formik'
import OFButton from '../baseComponents/button/OFButton'
import React from 'react'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'
import { OFSelect } from '../baseComponents/form/select/OFSelect'
import OFFormControl from '../baseComponents/form/formControl/OFFormControl'
import MenuItem from '@material-ui/core/MenuItem'
import { OrganizationRoleInfo } from '../organization/users/OrganizationRoleInfos'
import OFAutoComplete from '../baseComponents/form/autoComplete/OFAutoComplete'
import { renderUserAutoCompleteOption } from './components/UserAutocompleteOption'

const UserInvitePanel = ({
    isOpen,
    onClose,
    onSubmit,
    userTypes,
    usersDetails = {},
}) => {
    const { t } = useTranslation()
    return (
        <SidePanelLayout
            title={t('users.add')}
            isOpen={isOpen}
            onClose={onClose}>
            <Formik
                validationSchema={object().shape({
                    email: string()
                        .transform(function (value) {
                            if (value instanceof Object) {
                                return value.email
                            }
                            return value
                        })
                        .email(t('users.emailNotValid'))
                        .required(t('users.emailRequired')),
                    userType: string(t('users.typeNotValid')).required(
                        t('users.typeRequired')
                    ),
                })}
                initialValues={{
                    email: null,
                    userType: userTypes[0],
                }}
                onSubmit={(values) => {
                    const email =
                        values.email instanceof Object
                            ? values.email.email
                            : values.email
                    onSubmit(email, values.userType)
                }}>
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <OFFormControl
                            name={t('users.memberEmail')}
                            fieldName="email"
                            type="text">
                            <Field
                                name="email"
                                dataArray={Object.values(usersDetails)}
                                keyToDisplay={['email']}
                                freeSolo={true}
                                renderOption={renderUserAutoCompleteOption}
                                component={OFAutoComplete}
                            />
                        </OFFormControl>

                        {userTypes.length > 1 && (
                            <>
                                <OFFormControl
                                    fieldName="userType"
                                    name={t('users.userType')}>
                                    <Field name="userType" component={OFSelect}>
                                        {userTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {t(`users.${type}`)}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </OFFormControl>
                                <OrganizationRoleInfo />
                            </>
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
