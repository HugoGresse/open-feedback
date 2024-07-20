import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import { COLORS } from '../../../constants/colors'
import Hidden from '@mui/material/Hidden'
import Step1 from './Step1.jsx'
import Step2 from './Step2.jsx'
import Step3 from './Step3.jsx'
import { useDispatch } from 'react-redux'
import { getNewProjectId } from '../core/projectUtils'
import { PROJECT_TYPE_OPENFEEDBACK } from '../../../core/setupType/projectApi'
import { useTranslation } from 'react-i18next'
import { sleep } from '../../../utils/sleep'
import {
    fillDefaultVotingForm,
    getVoteItems,
    saveVoteItems,
} from '../settings/votingForm/votingFormActions.jsx'
import { redirectToProject } from '../utils/redirectToProject'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { DialogContent } from '@mui/material'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent.jsx'
import { newProject } from '../core/actions/newProject'
import { selectProject } from '../core/actions/selectUnselectProject'
import { getProject } from '../core/actions/getProject'
import { NO_ORGANIZATION_FAKE_ID } from '../../organization/core/organizationConstants'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles({
    container: {
        minHeight: '100vh',
        minWidth: '100vw',
    },
    leftContainer: {
        background: COLORS.ADMIN_BACKGROUND_LIGHT,
    },
    rightContainer: {
        background: COLORS.RED_ORANGE,
    },
})

const NewProject = ({ organizationId, onCancel }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const projectIdDefaultValue = getNewProjectId()
    const [currentStep, setCurrentStep] = useState(1)
    const [projectName, setProjectName] = useState('')
    const [projectId, setProjectId] = useState(projectIdDefaultValue)
    const [projectType, setProjectType] = useState(PROJECT_TYPE_OPENFEEDBACK)
    const [useOrganizationSettings, setUseOrganizationSettings] = useState(
        organizationId !== NO_ORGANIZATION_FAKE_ID
    )
    const [step3Data, setStep3Data] = useState()
    const [isCreatingEvent, setCreatingEvent] = useState(false)

    const createEvent = (projectId, useOrganizationSettings, data) => {
        setCreatingEvent(true)
        return dispatch(
            newProject(organizationId, projectId, data, useOrganizationSettings)
        )
            .then((projectId) => {
                if (!projectId) {
                    return Promise.reject('Event not created')
                }
                return Promise.all([
                    dispatch(getProject(projectId)),
                    dispatch(selectProject(projectId)),
                ])
            })
            .then(async () => {
                if (!useOrganizationSettings) {
                    await dispatch(fillDefaultVotingForm(t))
                    await dispatch(saveVoteItems(true))
                    // The votes were saved in db but the query to retrieve does not return them if queried directly after (sometimes)
                    await sleep(1000)
                }
                await dispatch(getProject())
                await dispatch(getVoteItems())

                setCreatingEvent(false)
                redirectToProject(null, projectId, navigate)
            })
            .catch(() => {
                setCreatingEvent(false)
            })
    }

    return (
        <Grid container className={classes.container}>
            <Grid item xs={12} lg={9} className={classes.leftContainer}>
                {currentStep === 1 && (
                    <Step1
                        onCancel={onCancel}
                        onSubmit={(projectName, projectId) => {
                            setCurrentStep(2)
                            setProjectName(projectName)
                            if (projectId !== projectIdDefaultValue) {
                                setProjectId(projectId.trim().toLowerCase())
                            } else {
                                setProjectId(projectId)
                            }
                        }}
                        initialValues={{ name: projectName, id: projectId }}
                    />
                )}
                {currentStep === 2 && (
                    <Step2
                        onCancel={onCancel}
                        onBack={() => setCurrentStep(1)}
                        onSubmit={(newProjectType, useOrganizationSettings) => {
                            if (newProjectType === PROJECT_TYPE_OPENFEEDBACK) {
                                return createEvent(
                                    projectId,
                                    useOrganizationSettings,
                                    {
                                        name: projectName,
                                        setupType: newProjectType,
                                    }
                                )
                            }
                            setProjectType(newProjectType)
                            setUseOrganizationSettings(useOrganizationSettings)
                            if (projectType !== newProjectType) {
                                setStep3Data()
                            }
                            setCurrentStep(3)
                        }}
                        displayOrganizationSettings={
                            organizationId !== NO_ORGANIZATION_FAKE_ID
                        }
                        initialValues={{
                            projectType: projectType,
                            useOrganizationSettings: useOrganizationSettings,
                        }}
                    />
                )}

                {currentStep === 3 && (
                    <Step3
                        onCancel={onCancel}
                        onBack={(data) => {
                            setStep3Data(data)
                            setCurrentStep(2)
                        }}
                        initialValues={step3Data}
                        projectType={projectType}
                        onSubmit={(config) =>
                            createEvent(projectId, useOrganizationSettings, {
                                name: projectName,
                                setupType: projectType,
                                config: config,
                            })
                        }
                    />
                )}
            </Grid>

            <Hidden lgDown>
                <Grid item sm={3} className={classes.rightContainer} />
            </Hidden>
            <Dialog
                aria-labelledby="creating-event-waiting"
                TransitionProps={{ role: 'presentation' }}
                open={isCreatingEvent}>
                <DialogTitle id="creating-event-waiting">
                    {t('newEvent.dialogCreating')}
                </DialogTitle>
                <DialogContent>
                    <LoaderMatchParent height="80px" />
                </DialogContent>
            </Dialog>
        </Grid>
    );
}

export default NewProject
