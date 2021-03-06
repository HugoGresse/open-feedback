import React from 'react'
import { OrgDataInfo } from '../layout/OrgDataInfo'
import Grid from '@material-ui/core/Grid'
import SidePanelUploadLayout from '../../baseComponents/layouts/sidepanel/upload/SidePanelUploadLayout'
import OFFormControl from '../../baseComponents/form/formControl/OFFormControl'
import { Field, Form, Formik } from 'formik'
import ChipColorsEditor from '../../project/settings/event/ChipColorsEditor'
import { object, string } from 'yup'
import { rURLWithLocalhostSupported } from '../../project/utils/rURLWithLocalhostSupported'
import { useTranslation } from 'react-i18next'
import { getSelectedOrganizationSelector } from '../core/organizationSelectors'
import { useDispatch, useSelector } from 'react-redux'
import OFButton from '../../baseComponents/button/OFButton'
import Divider from '@material-ui/core/Divider'
import { editOrganization } from '../core/actions/editOrganization'
import Box from '@material-ui/core/Box'

export const OrganizationTheme = () => {
    const dispatch = useDispatch()
    const organization = useSelector(getSelectedOrganizationSelector)
    const { t } = useTranslation()

    const initialValues = {
        logoSmall: organization.logoSmall || '',
        favicon: organization.favicon || '',
        chipColors: organization.chipColors,
    }

    return (
        <Box padding={2} paddingTop={0}>
            <OrgDataInfo />
            <Formik
                validationSchema={object().shape({
                    logoSmall: string()
                        .matches(
                            rURLWithLocalhostSupported,
                            t('settingsEvent.fieldLogoUrlNotValid')
                        )
                        .required(t('settingsEvent.fieldLogoUrlRequired')),
                    favicon: string()
                        .matches(
                            rURLWithLocalhostSupported,
                            t('settingsEvent.fieldFaviconUrlNotValid')
                        )
                        .required(t('settingsEvent.fieldFaviconUrlRequired')),
                })}
                initialValues={initialValues}
                onSubmit={(values) => dispatch(editOrganization(values))}>
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={4}>
                                <SidePanelUploadLayout
                                    name={t('settingsEvent.fieldLogoUrl')}
                                    fieldName="logoSmall"
                                    isSubmitting={isSubmitting}
                                    title={t('settingsEvent.fieldLogoUrl')}
                                    helpText={t('baseComponents.imageHelp')}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <SidePanelUploadLayout
                                    name={t('settingsEvent.fieldFaviconUrl')}
                                    fieldName="favicon"
                                    isSubmitting={isSubmitting}
                                    title={t('settingsEvent.fieldFaviconUrl')}
                                    helpText={t('baseComponents.imageHelp')}
                                    finalImageWidth={200}
                                    finalImageHeight={200}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <OFFormControl
                                    name={t('settingsEvent.fieldChipColors')}
                                    fieldName="chipColors">
                                    <Field
                                        name="chipColors"
                                        component={ChipColorsEditor}
                                    />
                                </OFFormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                                <br />
                                <OFButton
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    type="submit">
                                    {t('common.save')}
                                </OFButton>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}
