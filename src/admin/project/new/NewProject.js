import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { COLORS } from '../../../constants/colors'
import Hidden from '@material-ui/core/Hidden'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import { useDispatch } from 'react-redux'
import { newProject } from '../core/projectActions'
import { history } from '../../../App'
import { PROJECT_TYPE_OPENFEEDBACK } from '../../../core/setupType/projectApi'

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

    const [currentStep, setCurrentStep] = useState(1)
    const [projectName, setProjectName] = useState('')
    const [projectType, setProjectType] = useState('')
    const [step3Data, setStep3Data] = useState()

    const createEvent = project => {
        return dispatch(newProject(project)).then(projectId => {
            return history.push(`/admin/${projectId}/setting/event`)
        })
    }

    return (
        <Grid container className={classes.container}>
            <Grid item xs={12} sm={9} className={classes.leftContainer}>
                {currentStep === 1 && (
                    <Step1
                        onCancel={onCancel}
                        onSubmit={projectName => {
                            setCurrentStep(2)
                            setProjectName(projectName)
                        }}
                        initialValues={{ name: projectName }}
                    />
                )}
                {currentStep === 2 && (
                    <Step2
                        onCancel={onCancel}
                        onBack={() => setCurrentStep(1)}
                        onSubmit={newProjectType => {
                            if (newProjectType === PROJECT_TYPE_OPENFEEDBACK) {
                                return createEvent({
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
                            createEvent({
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
        </Grid>
    )
}

export default NewProject
