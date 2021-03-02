import React from 'react'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import OFFormControlInputFormiked from '../baseComponents/form/formControl/OFFormControlInputFormiked'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { object, string } from 'yup'
import { useDispatch } from 'react-redux'
import { newOrganization } from '../organization/core/actions/newOrganization'
import { redirectToOrganization } from '../organization/utils/redirectToOrganization'
import { useHistory } from 'react-router-dom'
import {
    fillDefaultVotingForm,
    saveVoteItems,
} from '../project/settings/votingForm/votingFormActions'
import { sleep } from '../../utils/sleep'
import { selectOrganization } from '../organization/core/actions/selectUnselectActions'

export const OrganisationNewDialog = ({ onClose, open }) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const title = t('organization.new')
    const history = useHistory()

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
                                redirectToOrganization(organizationId, history)
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
                            <Button
                                onClick={onClose}
                                disabled={isSubmitting}
                                color="secondary">
                                {t('common.cancel')}
                            </Button>
                            <Button
                                color="secondary"
                                type="submit"
                                disabled={isSubmitting}
                                variant="contained">
                                {t('organization.create')}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}
