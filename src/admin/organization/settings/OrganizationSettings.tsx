import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import { useTranslation } from 'react-i18next'
import { OFButton } from '../../baseComponents/button/OFButton.tsx'
import { object, string } from 'yup'
import { Form, Formik } from 'formik'
import { getSelectedOrganizationSelector } from '../core/organizationSelectors'
import { OFFormControlInputFormiked } from '../../baseComponents/form/formControl/OFFormControlInputFormiked.tsx'
import SaveIcon from '@mui/icons-material/Save'
import Box from '@mui/material/Box'
import { editOrganization } from '../core/actions/editOrganization'
import { useAppDispatch, useAppSelector } from '../../../store'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { getUserIdSelector } from '../../auth/authSelectors'
import { DeleteOrganization } from './DeleteOrganization.tsx'

export interface OrganizationSettingsProps {
    onClose: () => void
    onOrganizationDeleted: () => void
}

export const OrganizationSettings = ({
    onClose,
    onOrganizationDeleted,
}: OrganizationSettingsProps) => {
    const { t } = useTranslation()
    const organization = useAppSelector(getSelectedOrganizationSelector)
    const userId = useAppSelector(getUserIdSelector)
    // Only the owner can delete the organization (see firestore.rules)
    const isOwner = !!organization && organization.ownerUserId === userId
    const dispatch = useAppDispatch()

    return (
        <Dialog
            open={true}
            fullWidth={true}
            maxWidth="sm"
            onClose={onClose}
            aria-labelledby={t('organization.settings')}
        >
            <DialogTitle id="org-settings">
                {t('organization.settings')}
            </DialogTitle>
            <DialogContent>
                <Formik
                    validationSchema={object().shape({
                        name: string().required(t('organization.nameRequired')),
                    })}
                    initialValues={{
                        // Only displayed while an organization is loaded.
                        name: organization?.name ?? '',
                    }}
                    onSubmit={(values) => {
                        return dispatch(
                            editOrganization({
                                name: values.name,
                            })
                        ).then(() => onClose())
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form method="POST">
                            <OFFormControlInputFormiked
                                name={t('organization.name')}
                                fieldName="name"
                                type="text"
                                isSubmitting={isSubmitting}
                                color="secondary"
                            />

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                marginTop={4}
                                marginBottom={2}
                            >
                                <OFButton
                                    onClick={onClose}
                                    style={{ design: 'text' }}
                                >
                                    {t('common.back')}
                                </OFButton>
                                <OFButton
                                    startIcon={<SaveIcon />}
                                    type="submit"
                                >
                                    {t('common.save')}
                                </OFButton>
                            </Box>
                        </Form>
                    )}
                </Formik>
                {organization && isOwner && (
                    <>
                        <Divider />
                        <Box marginTop={2} marginBottom={1}>
                            <Typography variant="h6">
                                {t('organization.delete.sectionTitle')}
                            </Typography>
                            <Typography variant="body2" marginBottom={1}>
                                {t('organization.delete.sectionDescription')}
                            </Typography>
                            <DeleteOrganization
                                organizationId={organization.id}
                                organizationName={organization.name}
                                onDeleted={() => {
                                    onClose()
                                    onOrganizationDeleted()
                                }}
                            />
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
