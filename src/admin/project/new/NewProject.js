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

const useStyles = makeStyles({
    container: {
        minHeight: '100vh',
        minWidth: '100vw'
    },
    leftContainer: {
        background: COLORS.ADMIN_BACKGROUND_LIGHT
    },
    rightContainer: {
        background: COLORS.RED_ORANGE
    }
})
const NewProject = ({ onCancel }) => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [currentStep, setCurrentStep] = useState(1)
    const [projectName, setProjectName] = useState('')
    const [projectType, setProjectType] = useState('')
    const [step3Data, setStep3Data] = useState()

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
                            setCurrentStep(3)
                            if (projectType !== newProjectType) {
                                setStep3Data()
                            }
                            setProjectType(newProjectType)
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
                        onSubmit={data => {
                            dispatch(
                                newProject({
                                    name: projectName,
                                    setupType: projectType,
                                    config: data
                                })
                            ).then(projectId => {
                                history.push(
                                    `/admin/${projectId}/setting/event`
                                )
                            })
                        }}
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
