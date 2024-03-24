import React from 'react'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import OFFormControlInputFormiked from '../baseComponents/form/formControl/OFFormControlInputFormiked.jsx'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { object, string } from 'yup'
import { useDispatch } from 'react-redux'
import { newOrganization } from '../organization/core/actions/newOrganization'
import { redirectToOrganization } from '../organization/utils/redirectToOrganization'
import { useNavigate } from 'react-router-dom'
import {
    fillDefaultVotingForm,
    saveVoteItems,
} from '../project/settings/votingForm/votingFormActions.jsx'
import { sleep } from '../../utils/sleep'
import { selectOrganization } from '../organization/core/actions/selectUnselectActions'
import OFButton from '../baseComponents/button/OFButton.jsx'

export const OrganisationNewDialog = ({ onClose, open }) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const title = t('organization.new')
    const navigate = useNavigate()

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby={title}
            fullWidth={true}
            maxWidth="sm">
            <DialogTitle id={title}>{title}</DialogTitle>
            <Formik
                initialValues={{
                    name: '',
                }}
                validationSchema={object().shape({
                    name: string().required(t('organization.nameRequired')),
                })}
                onSubmit={(values) => {
                    return dispatch(newOrganization(values.name.trim())).then(
                        async (organizationId) => {
                            if (organizationId) {
                                dispatch(selectOrganization(organizationId))
                                await dispatch(fillDefaultVotingForm(t))
                                await dispatch(saveVoteItems(true))
                                await sleep(1000)
                                redirectToOrganization(organizationId, navigate)
                            }
                            onClose()
                        }
                    )
                }}>
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <DialogContent>
                            <OFFormControlInputFormiked
                                name={t('organization.name')}
                                fieldName="name"
                                type="text"
                                isSubmitting={isSubmitting}
                                autoFocus={true}
                                color="secondary"
                            />
                            <br />
                            <br />
                        </DialogContent>
                        <DialogActions>
                            <OFButton
                                onClick={onClose}
                                disabled={isSubmitting}
                                style={{ design: 'text' }}
                                color="secondary">
                                {t('common.cancel')}
                            </OFButton>
                            <OFButton
                                color="secondary"
                                type="submit"
                                disabled={isSubmitting}
                                loading={isSubmitting}
                                variant="contained">
                                {t('organization.create')}
                            </OFButton>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}
