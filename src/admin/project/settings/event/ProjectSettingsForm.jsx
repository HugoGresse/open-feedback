import React, { useState } from 'react'
import { object, string, boolean } from 'yup'
import { Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import OFFormControl from '../../../baseComponents/form/formControl/OFFormControl.jsx'
import Grid from '@mui/material/Grid'
import OFButton from '../../../baseComponents/button/OFButton.jsx'
import { makeStyles } from '@mui/styles'
import { useDispatch } from 'react-redux'
import ChipColorsEditor from './ChipColorsEditor.jsx'
import OFFormControlInputFormiked from '../../../baseComponents/form/formControl/OFFormControlInputFormiked.jsx'
import FormControlLabel from '@mui/material/FormControlLabel'
import { OFSwitch } from '../../../baseComponents/form/switch/OFSwitch.jsx'
import { useTranslation } from 'react-i18next'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography.jsx'
import { DateTime } from 'luxon'
import SidePanelUploadLayout from '../../../baseComponents/layouts/sidepanel/upload/SidePanelUploadLayout.jsx'
import { editProject } from '../../core/actions/editProject'
import RestrictVoteRangeFields from './RestrictVoteRangeFields.jsx'
import { SaveShortcut } from '../../../baseComponents/form/saveShortcut/SaveShortcut'

const useStyles = makeStyles((theme) => ({
    buttonContainer: {
        textAlign: 'right',
    },
    chipLabel: {
        marginTop: theme.spacing(3),
    },
    reducedLabelFontSize: {
        fontSize: theme.typography.fontSize * 0.9,
    },
}))

const ProjectSettingsForm = ({ project }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [errorOnSubmit, setErrorSubmit] = useState(false)

    const initialValues = {
        name: project.name,
        scheduleLink: project.scheduleLink || '',
        logoUrl: project.logoSmall || '',
        faviconUrl: project.favicon || '',
        chipColors: project.chipColors,
        restrictVoteRange: !!project.voteStartTime,
        voteStartTime: DateTime.fromISO(project.voteStartTime) || DateTime.local(),
        voteEndTime: DateTime.fromISO(project.voteEndTime) || DateTime.local(),
        hideEventName: project.hideEventName || false,
    }

    return (
        <Formik
            validationSchema={object().shape({
                name: string().required(t('settingsEvent.fieldNameRequired')),
                scheduleLink: string().url(
                    t('settingsEvent.fieldScheduleNotValid')
                ),
                logoUrl: string()
                    .required(t('settingsEvent.fieldLogoUrlRequired')),
                faviconUrl: string()
                    .required(t('settingsEvent.fieldFaviconUrlRequired')),
                restrictVoteRange: boolean(),
                voteStartTime: string(),
                voteEndTime: string(),
                hideEventName: boolean().required(),
            })}
            initialValues={initialValues}
            onSubmit={(values) =>
                dispatch(
                    editProject({
                        chipColors: values.chipColors,
                        favicon: values.faviconUrl,
                        logoSmall: values.logoUrl,
                        name: values.name,
                        scheduleLink: values.scheduleLink,
                        restrictVoteRange: values.restrictVoteRange,
                        voteStartTime: DateTime.fromISO(
                            values.voteStartTime
                        ).toISO(),
                        voteEndTime: DateTime.fromISO(
                            values.voteEndTime
                        ).toISO(),
                        hideEventName: values.hideEventName,
                    })
                )
            }>
            {({ isSubmitting, values, errors }) => (
                <Form method="POST">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">Event</Typography>
                            <OFFormControlInputFormiked
                                name={t('settingsEvent.fieldName')}
                                fieldName="name"
                                type="text"
                                isSubmitting={isSubmitting}
                            />
                            <OFFormControl
                                fieldName="hideEventName"
                                noTopMargin>
                                <FormControlLabel
                                    label={t('settingsEvent.hideEventName')}
                                    classes={{
                                        label: classes.reducedLabelFontSize,
                                    }}
                                    control={
                                        <Field
                                            name="hideEventName"
                                            component={OFSwitch}
                                        />
                                    }
                                />
                            </OFFormControl>

                            <OFFormControlInputFormiked
                                name={t('settingsEvent.fieldSchedule')}
                                fieldName="scheduleLink"
                                type="text"
                                isSubmitting={isSubmitting}
                            />

                            <OFFormControl fieldName="restrictVoteRange">
                                <FormControlLabel
                                    label={t('settingsEvent.fieldVoteRange')}
                                    control={
                                        <Field
                                            name="restrictVoteRange"
                                            component={OFSwitch}
                                        />
                                    }
                                />
                            </OFFormControl>

                            <RestrictVoteRangeFields
                                isOpen={!!values.restrictVoteRange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">Theme</Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <SidePanelUploadLayout
                                        name={t('settingsEvent.fieldLogoUrl')}
                                        fieldName="logoUrl"
                                        isSubmitting={isSubmitting}
                                        title={t('settingsEvent.fieldLogoUrl')}
                                        helpText={t('baseComponents.imageHelp')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <SidePanelUploadLayout
                                        name={t(
                                            'settingsEvent.fieldFaviconUrl'
                                        )}
                                        fieldName="faviconUrl"
                                        isSubmitting={isSubmitting}
                                        title={t(
                                            'settingsEvent.fieldFaviconUrl'
                                        )}
                                        helpText={t('baseComponents.imageHelp')}
                                        finalImageWidthHeight={200}
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
                        </Grid>

                        <Grid item xs={12} className={classes.buttonContainer}>
                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                onClick={() => {
                                    if (errorArrayContainError(errors)) {
                                        setErrorSubmit(true)
                                    } else {
                                        setErrorSubmit(false)
                                    }
                                }}>
                                {t('settingsEvent.save')}
                            </OFButton>

                            {errorOnSubmit &&
                                errorArrayContainError(errors) && (
                                    <TranslatedTypography i18nKey="settingsEvent.error">
                                        errorMsg{' '}
                                    </TranslatedTypography>
                                )}
                        </Grid>
                    </Grid>

                    <SaveShortcut />
                </Form>
            )}
        </Formik>
    )
}

const errorArrayContainError = (errorArray) =>
    Object.values(errorArray).filter((el) => !!el).length > 0

export default ProjectSettingsForm
