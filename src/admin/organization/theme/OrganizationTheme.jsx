import React from 'react'
import { OrgDataInfo } from '../layout/OrgDataInfo.jsx'
import Grid from '@mui/material/Grid'
import SidePanelUploadLayout from '../../baseComponents/layouts/sidepanel/upload/SidePanelUploadLayout.jsx'
import OFFormControl from '../../baseComponents/form/formControl/OFFormControl.jsx'
import { Field, Form, Formik } from 'formik'
import ChipColorsEditor from '../../project/settings/event/ChipColorsEditor.jsx'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'
import { getSelectedOrganizationSelector } from '../core/organizationSelectors'
import { useDispatch, useSelector } from 'react-redux'
import OFButton from '../../baseComponents/button/OFButton.jsx'
import Divider from '@mui/material/Divider'
import { editOrganization } from '../core/actions/editOrganization'
import Box from '@mui/material/Box'
import { SaveShortcut } from '../../baseComponents/form/saveShortcut/SaveShortcut'

export const OrganizationTheme = () => {
    const dispatch = useDispatch()
    const organization = useSelector(getSelectedOrganizationSelector)
    const { t } = useTranslation()

    const initialValues = {
        logoUrl: organization.logoSmall || '',
        faviconUrl: organization.favicon || '',
        chipColors: organization.chipColors,
    }

    return (
        <Box padding={2} paddingTop={0}>
            <OrgDataInfo />
            <Formik
                validationSchema={object().shape({
                    logoUrl: string()
                        .required(t('settingsEvent.fieldLogoUrlRequired')),
                    faviconUrl: string()
                        .required(t('settingsEvent.fieldFaviconUrlRequired')),
                })}
                initialValues={initialValues}
                onSubmit={(values) =>
                    dispatch(
                        editOrganization({
                            logoSmall: values.logoUrl,
                            favicon: values.faviconUrl,
                            chipColors: values.chipColors,
                        })
                    )
                }>
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={4}>
                                <SidePanelUploadLayout
                                    name={t('settingsEvent.fieldLogoUrl')}
                                    fieldName="logoUrl"
                                    isSubmitting={isSubmitting}
                                    title={t('settingsEvent.fieldLogoUrl')}
                                    helpText={t('baseComponents.imageHelp')}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <SidePanelUploadLayout
                                    name={t('settingsEvent.fieldFaviconUrl')}
                                    fieldName="faviconUrl"
                                    isSubmitting={isSubmitting}
                                    title={t('settingsEvent.fieldFaviconUrl')}
                                    helpText={t('baseComponents.imageHelp')}
                                    finalImageWidthHeight={200}
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

                        <SaveShortcut />
                    </Form>
                )}
            </Formik>
        </Box>
    )
}
