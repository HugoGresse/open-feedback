import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { COLORS } from '../../../constants/colors'
import Hidden from '@material-ui/core/Hidden'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import { useDispatch } from 'react-redux'
import {
    getNewProjectId,
    getProject,
    newProject,
    selectProject,
} from '../core/projectActions'
import { PROJECT_TYPE_OPENFEEDBACK } from '../../../core/setupType/projectApi'
import { useTranslation } from 'react-i18next'
import { sleep } from '../../../utils/sleep'
import {
    fillDefaultVotingForm,
    getVoteItems,
} from '../settings/votingForm/votingFormActions'
import { redirectToProject } from '../utils/redirectToProject'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import { DialogContent } from '@material-ui/core'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'

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

const NewProject = ({ onCancel }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const projectIdDefaultValue = getNewProjectId()
    const [currentStep, setCurrentStep] = useState(1)
    const [projectName, setProjectName] = useState('')
    const [projectId, setProjectId] = useState(projectIdDefaultValue)
    const [projectType, setProjectType] = useState('')
    const [step3Data, setStep3Data] = useState()
    const [isCreatingEvent, setCreatingEvent] = useState(false)

    const createEvent = (id, data) => {
        setCreatingEvent(true)
        return dispatch(newProject(id, data))
            .then(projectId => {
                return Promise.all([
                    dispatch(getProject(projectId)),
                    dispatch(selectProject(projectId)),
                ])
            })
            .then(async () => {
                await dispatch(fillDefaultVotingForm(t))
                // The votes was saved in db but the query to retrieve does not returns them if queried directly after (sometimes)
                await sleep(1000)
                await dispatch(getProject())
                await dispatch(getVoteItems())

                setCreatingEvent(false)
                redirectToProject(null, projectId)
            })
    }

    return (
        <Grid container className={classes.container}>
            <Grid item xs={12} sm={9} className={classes.leftContainer}>
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
                        onSubmit={newProjectType => {
                            if (newProjectType === PROJECT_TYPE_OPENFEEDBACK) {
                                return createEvent(projectId, {
                                    name: projectName,
                                    setupType: newProjectType,
                                })
                            }
                            setProjectType(newProjectType)
                            if (projectType !== newProjectType) {
                                setStep3Data()
                            }
                            setCurrentStep(3)
                        }}
                        initialValues={{ projectType: projectType }}
                    />
                )}

                {currentStep === 3 && (
                    <Step3
                        onCancel={onCancel}
                        onBack={data => {
                            setStep3Data(data)
                            setCurrentStep(2)
                        }}
                        initialValues={step3Data}
                        projectType={projectType}
                        onSubmit={config =>
                            createEvent(projectId, {
                                name: projectName,
                                setupType: projectType,
                                config: config,
                            })
                        }
                    />
                )}
            </Grid>

            <Hidden xsDown>
                <Grid item sm={3} className={classes.rightContainer} />
            </Hidden>
            <Dialog
                aria-labelledby="creating-event-waiting"
                open={isCreatingEvent}>
                <DialogTitle id="creating-event-waiting">
                    {t('newEvent.dialogCreating')}
                </DialogTitle>
                <DialogContent>
                    <LoaderMatchParent height="80px" />
                </DialogContent>
            </Dialog>
        </Grid>
    )
}

export default NewProject
