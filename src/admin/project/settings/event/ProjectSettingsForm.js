import React, { useState } from 'react'
import { object, string, boolean } from 'yup'
import { Typography } from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import OFFormControl from '../../../baseComponents/form/formControl/OFFormControl'
import Grid from '@material-ui/core/Grid'
import OFButton from '../../../baseComponents/button/OFButton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useDispatch } from 'react-redux'
import { editProject } from '../../core/projectActions'
import ChipColorsEditor from './ChipColorsEditor'
import OFFormControlInputFormiked from '../../../baseComponents/form/formControl/OFFormControlInputFormiked'
import OFDateTimePicker from '../../../baseComponents/form/dateTimePicker/OFDateTimePicker'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { OFSwitch } from '../../../baseComponents/form/switch/OFSwitch'
import Collapse from '@material-ui/core/Collapse'
import { useTranslation } from 'react-i18next'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography'
import { DateTime } from 'luxon'

const useStyles = makeStyles(theme => ({
    buttonContainer: {
        textAlign: 'right',
    },
    chipLabel: {
        marginTop: theme.spacing(3),
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
        voteStartTime: project.voteStartTime || DateTime.local().toISO(),
        voteEndTime: project.voteEndTime || DateTime.local().toISO(),
    }

    return (
        <Formik
            validationSchema={object().shape({
                name: string().required(t('settingsEvent.fieldNameRequired')),
                scheduleLink: string().url(
                    t('settingsEvent.fieldScheduleNotValid')
                ),
                logoUrl: string()
                    .url(t('settingsEvent.fieldLogoUrlNotValid'))
                    .required(t('settingsEvent.fieldLogoUrlRequired')),
                faviconUrl: string()
                    .url(t('settingsEvent.fieldFaviconUrlNotValid'))
                    .required(t('settingsEvent.fieldFaviconUrlRequired')),
                restrictVoteRange: boolean(),
                voteStartTime: string(),
                voteEndTime: string(),
            })}
            initialValues={initialValues}
            onSubmit={values =>
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

                            <Collapse in={values.restrictVoteRange}>
                                <div>
                                    <OFFormControl
                                        name={t('settingsEvent.fieldVoteOpen')}
                                        fieldName="voteStartTime">
                                        <Field
                                            name="voteStartTime"
                                            format="FFF"
                                            component={OFDateTimePicker}
                                        />
                                    </OFFormControl>

                                    <OFFormControl
                                        name={t('settingsEvent.fieldVoteClose')}
                                        fieldName="voteEndTime">
                                        <Field
                                            name="voteEndTime"
                                            format="FFF"
                                            component={OFDateTimePicker}
                                        />
                                    </OFFormControl>
                                </div>
                            </Collapse>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">Theme</Typography>
                            <OFFormControlInputFormiked
                                name={t('settingsEvent.fieldLogoUrl')}
                                fieldName="logoUrl"
                                type="text"
                                isSubmitting={isSubmitting}
                            />

                            <OFFormControlInputFormiked
                                name={t('settingsEvent.fieldFaviconUrl')}
                                fieldName="faviconUrl"
                                type="text"
                                isSubmitting={isSubmitting}
                            />

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
                </Form>
            )}
        </Formik>
    )
}

const errorArrayContainError = errorArray =>
    Object.values(errorArray).filter(el => !!el).length > 0

export default ProjectSettingsForm
