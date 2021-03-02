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
import { useSelector } from 'react-redux'

export const OrganizationTheme = () => {
    const { t } = useTranslation()

    const organization = useSelector(getSelectedOrganizationSelector)

    const initialValues = {
        logoUrl: organization.logoSmall || '',
        faviconUrl: organization.favicon || '',
        chipColors: organization.chipColors,
    }

    // TODO :
    // editOrg save fav/logo/chips

    return (
        <>
            <OrgDataInfo />
            <Formik
                validationSchema={object().shape({
                    scheduleLink: string().url(
                        t('settingsEvent.fieldScheduleNotValid')
                    ),
                    logoUrl: string()
                        .matches(
                            rURLWithLocalhostSupported,
                            t('settingsEvent.fieldLogoUrlNotValid')
                        )
                        .required(t('settingsEvent.fieldLogoUrlRequired')),
                    faviconUrl: string()
                        .matches(
                            rURLWithLocalhostSupported,
                            t('settingsEvent.fieldFaviconUrlNotValid')
                        )
                        .required(t('settingsEvent.fieldFaviconUrlRequired')),
                })}
                initialValues={initialValues}
                onSubmit={(values) => console.log(values)}>
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
                                    finalImageWidth={200}
                                    finalImageHeight={200}
                                />
                            </Grid>
                        </Grid>

                        <OFFormControl
                            name={t('settingsEvent.fieldChipColors')}
                            fieldName="chipColors">
                            <Field
                                name="chipColors"
                                component={ChipColorsEditor}
                            />
                        </OFFormControl>
                    </Form>
                )}
            </Formik>
        </>
    )
}
