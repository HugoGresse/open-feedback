import React, { useState } from 'react'
import { object, string, boolean } from 'yup'
import { Typography } from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import OFFormControlFormiked from '../../../baseComponents/form/OFFormControlFormiked'
import Grid from '@material-ui/core/Grid'
import OFButton from '../../../baseComponents/OFButton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useDispatch } from 'react-redux'
import { editProject } from '../../core/projectActions'
import ChipColorsEditor from './ChipColorsEditor'
import OFFormControlInputFormiked from '../../../baseComponents/form/OFFormControlInputFormiked'
import OFDateTimePickerFormiked from '../../../baseComponents/form/OFDateTimePickerFormiked'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { SwitchFormiked } from '../../../baseComponents/form/SwitchFormiked'
import moment from 'moment'
import Collapse from '@material-ui/core/Collapse'

const schema = object().shape({
    name: string().required('The project name is required'),
    scheduleLink: string().url('The schedule link is not a valid url'),
    logoUrl: string()
        .url('The logo is not a valid url')
        .required('The logo is required'),
    faviconUrl: string()
        .url('The favicon is not a valid url')
        .required('The favicon is required'),
    restrictVoteRange: boolean(),
    voteStartTime: string(),
    voteEndTime: string(),
})

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
    const [errorOnSubmit, setErrorSubmit] = useState(false)

    const initialValues = {
        name: project.name,
        scheduleLink: project.scheduleLink || '',
        logoUrl: project.logoSmall || '',
        faviconUrl: project.favicon || '',
        chipColors: project.chipColors,
        restrictVoteRange: !!project.voteStartTime,
        voteStartTime: project.voteStartTime || Date.now(),
        voteEndTime: project.voteEndTime || Date.now(),
    }

    return (
        <Formik
            validationSchema={schema}
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
                        voteStartTime: moment(
                            values.voteStartTime
                        ).toISOString(),
                        voteEndTime: moment(values.voteEndTime).toISOString(),
                    })
                )
            }>
            {({ isSubmitting, values, errors }) => (
                <Form method="POST">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">Event</Typography>
                            <OFFormControlInputFormiked
                                name="Name"
                                fieldName="name"
                                type="text"
                                isSubmitting={isSubmitting}
                            />

                            <OFFormControlInputFormiked
                                name="Schedule Link"
                                fieldName="scheduleLink"
                                type="text"
                                isSubmitting={isSubmitting}
                            />

                            <OFFormControlFormiked fieldName="restrictVoteRange">
                                <FormControlLabel
                                    label="Restrict vote open/close time"
                                    control={
                                        <Field
                                            name="restrictVoteRange"
                                            component={SwitchFormiked}
                                        />
                                    }
                                />
                            </OFFormControlFormiked>

                            <Collapse in={values.restrictVoteRange}>
                                <div>
                                    <OFFormControlFormiked
                                        name="Vote open time (in your local timezone)"
                                        fieldName="voteStartTime">
                                        <Field
                                            name="voteStartTime"
                                            format="dddd, MMMM Do, Y [at] HH[h]mm [(]Z[)]"
                                            component={OFDateTimePickerFormiked}
                                        />
                                    </OFFormControlFormiked>

                                    <OFFormControlFormiked
                                        name="Vote end time (in your local timezone)"
                                        fieldName="voteEndTime">
                                        <Field
                                            name="voteEndTime"
                                            format="dddd, MMMM Do, Y [at] HH[h]mm [(]Z[)]"
                                            component={OFDateTimePickerFormiked}
                                        />
                                    </OFFormControlFormiked>
                                </div>
                            </Collapse>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">Theme</Typography>
                            <OFFormControlInputFormiked
                                name="Logo url (around 100*100px)"
                                fieldName="logoUrl"
                                type="text"
                                isSubmitting={isSubmitting}
                            />

                            <OFFormControlInputFormiked
                                name="Favicon url (.png or .ico)"
                                fieldName="faviconUrl"
                                type="text"
                                isSubmitting={isSubmitting}
                            />

                            <OFFormControlFormiked
                                name="Chip Colors"
                                fieldName="chipColors">
                                <Field
                                    name="chipColors"
                                    component={ChipColorsEditor}
                                />
                            </OFFormControlFormiked>
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
                                Save
                            </OFButton>

                            {errorOnSubmit &&
                                errorArrayContainError(errors) && (
                                    <Typography style={{}}>
                                        You have some error in here, would you
                                        mind fixing it before saving? Much
                                        appreciated.
                                    </Typography>
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
