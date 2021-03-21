import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import { useTranslation } from 'react-i18next'
import OFButton from '../../baseComponents/button/OFButton'
import { object, string } from 'yup'
import { Form, Formik } from 'formik'
import { getSelectedOrganizationSelector } from '../core/organizationSelectors'
import { useDispatch, useSelector } from 'react-redux'
import OFFormControlInputFormiked from '../../baseComponents/form/formControl/OFFormControlInputFormiked'
import SaveIcon from '@material-ui/icons/Save'
import Box from '@material-ui/core/Box'
import { editOrganization } from '../core/actions/editOrganization'

export const OrganizationSettings = ({ onClose }) => {
    const { t } = useTranslation()
    const organization = useSelector(getSelectedOrganizationSelector)
    const dispatch = useDispatch()

    return (
        <Dialog
            open={true}
            fullWidth={true}
            maxWidth="sm"
            onClose={onClose}
            aria-labelledby={t('organization.settings')}>
            <DialogTitle id="org-settings">
                {t('organization.settings')}
            </DialogTitle>
            <DialogContent>
                <Formik
                    validationSchema={object().shape({
                        name: string().required(t('organization.nameRequired')),
                    })}
                    initialValues={{
                        name: organization.name,
                    }}
                    onSubmit={(values) => {
                        console.log(values)
                        return dispatch(
                            editOrganization({
                                name: values.name,
                            })
                        ).then(() => onClose())
                    }}>
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
                                marginBottom={2}>
                                <OFButton
                                    onClick={onClose}
                                    style={{ design: 'text' }}>
                                    {t('common.back')}
                                </OFButton>
                                <OFButton
                                    startIcon={<SaveIcon />}
                                    type="submit">
                                    {t('common.save')}
                                </OFButton>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
