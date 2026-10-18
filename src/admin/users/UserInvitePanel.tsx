import { SidePanelLayout } from '../baseComponents/layouts/sidepanel/SidePanelLayout.tsx'
import { Field, Form, Formik } from 'formik'
import { OFButton } from '../baseComponents/button/OFButton.tsx'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'
import { OFSelect } from '../baseComponents/form/select/OFSelect.tsx'
import { OFFormControl } from '../baseComponents/form/formControl/OFFormControl.tsx'
import MenuItem from '@mui/material/MenuItem'
import { OrganizationRoleInfo } from '../organization/users/OrganizationRoleInfos.tsx'
import { OFAutoComplete } from '../baseComponents/form/autoComplete/OFAutoComplete.tsx'
import { renderUserAutoCompleteOption } from './components/UserAutocompleteOption.tsx'
import type { User } from '../../core/models'

interface UserInviteFormValues {
    /** Typed email, or a user picked in the autocomplete. */
    email: string | User | null
    userType: string
}

export interface UserInvitePanelProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (email: string, userType: string) => void
    userTypes: readonly string[]
    usersDetails?: Record<string, User>
}

export const UserInvitePanel = ({
    isOpen,
    onClose,
    onSubmit,
    userTypes,
    usersDetails = {},
}: UserInvitePanelProps) => {
    const { t } = useTranslation()
    return (
        <SidePanelLayout
            title={t('users.add')}
            isOpen={isOpen}
            onClose={onClose}
            containerProps={{
                sx: {
                    zIndex: 1300,
                },
            }}
        >
            <Formik<UserInviteFormValues>
                validationSchema={object().shape({
                    email: string()
                        .transform(function (value: unknown) {
                            if (value instanceof Object) {
                                return (value as User).email
                            }
                            return value
                        })
                        .email(t('users.emailNotValid'))
                        .required(t('users.emailRequired')),
                    userType: string().required(t('users.typeRequired')),
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
                    // The schema validated it as a required email.
                    onSubmit(email as string, values.userType)
                }}
            >
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <OFFormControl
                            name={t('users.memberEmail')}
                            fieldName="email"
                            type="text"
                        >
                            <Field
                                name="email"
                                // Only users with an email can be invited
                                dataArray={Object.values(usersDetails).filter(
                                    (user) => !!user.email
                                )}
                                keyToDisplay="email"
                                freeSolo={true}
                                renderOption={renderUserAutoCompleteOption}
                                component={OFAutoComplete}
                            />
                        </OFFormControl>

                        {userTypes.length > 1 && (
                            <>
                                <OFFormControl
                                    fieldName="userType"
                                    name={t('users.userType')}
                                >
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
                            }}
                        >
                            {t('users.submit')}
                        </OFButton>
                    </Form>
                )}
            </Formik>
        </SidePanelLayout>
    )
}
