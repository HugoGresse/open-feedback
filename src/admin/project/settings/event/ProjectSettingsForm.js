import React from 'react'
import { object, string } from 'yup'
import { Typography } from '@material-ui/core'
import { Form, Formik } from 'formik'
import OFFormControlFormiked from '../../../baseComponents/OFFormControlFormiked'
import Grid from '@material-ui/core/Grid'
import OFButton from '../../../baseComponents/OFButton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useDispatch } from 'react-redux'
import { editProject } from '../../core/projectActions'

const schema = object().shape({
    name: string().required(
        <Typography>The project name is required</Typography>
    ),
    websiteLink: string()
        .url(
            <Typography variant="subtitle2">
                The website link is not a valid url
            </Typography>
        )
        .required(
            <Typography variant="subtitle2">
                The website link is required
            </Typography>
        ),
    scheduleLink: string()
        .url(
            <Typography variant="subtitle2">
                The schedule link is not a valid url
            </Typography>
        )
        .required(
            <Typography variant="subtitle2">
                The schedule link is required
            </Typography>
        ),
    logoUrl: string()
        .url(
            <Typography variant="subtitle2">
                The logo is not a valid url
            </Typography>
        )
        .required(
            <Typography variant="subtitle2">The logo is required</Typography>
        ),
    faviconUrl: string()
        .url(
            <Typography variant="subtitle2">
                The favicon is not a valid url
            </Typography>
        )
        .required(
            <Typography variant="subtitle2">The favicon is required</Typography>
        )
})

const useStyles = makeStyles(theme => ({
    buttonContainer: {
        textAlign: 'right'
    }
}))

const ProjectSettingsForm = ({ project }) => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const initialValues = {
        name: project.name,
        websiteLink: project.websiteLink,
        scheduleLink: project.scheduleLink,
        logoUrl: project.logoSmall,
        faviconUrl: project.favicon,
        chipColors: project.chipColors
    }

    return (
        <Formik
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={(values, actions) => {
                dispatch(
                    editProject({
                        chipColors: values.chipColors,
                        favicon: values.faviconUrl,
                        logoSmall: values.logoUrl,
                        name: values.name,
                        scheduleLink: values.scheduleLink,
                        websiteLink: values.websiteLink
                    })
                ).then(() => {
                    actions.setSubmitting(false)
                })
            }}
        >
            {({ isSubmitting }) => (
                <Form method="POST">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">Event</Typography>
                            <OFFormControlFormiked
                                name="Name"
                                fieldName="name"
                                type="text"
                                isSubmitting={isSubmitting}
                            />

                            <OFFormControlFormiked
                                name="Website Link"
                                fieldName="websiteLink"
                                type="text"
                                value={project.websiteLink}
                                isSubmitting={isSubmitting}
                            />

                            <OFFormControlFormiked
                                name="Schedule Link"
                                fieldName="scheduleLink"
                                type="text"
                                value={project.scheduleLink}
                                isSubmitting={isSubmitting}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">Theme</Typography>
                            <OFFormControlFormiked
                                name="Logo url (around 100*100px)"
                                fieldName="logoUrl"
                                type="text"
                                value={project.logoSmall}
                                isSubmitting={isSubmitting}
                            />

                            <OFFormControlFormiked
                                name="Favicon url (.png or .ico)"
                                fieldName="faviconUrl"
                                type="text"
                                value={project.favicon}
                                isSubmitting={isSubmitting}
                            />

                            <OFFormControlFormiked
                                name="Chip Colors"
                                fieldName="chipColors"
                                type="text"
                                value={project.chipColors}
                                isSubmitting={isSubmitting}
                            />
                        </Grid>

                        <Grid item xs={12} className={classes.buttonContainer}>
                            <OFButton disabled={isSubmitting} type="submit">
                                Save
                            </OFButton>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    )
}

export default ProjectSettingsForm
