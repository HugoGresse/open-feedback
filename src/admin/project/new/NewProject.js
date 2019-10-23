import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import {COLORS} from '../../../constants/colors'
import Hidden from '@material-ui/core/Hidden'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const useStyles = makeStyles({
    container: {
        minHeight: '100vh'
    },
    leftContainer: {
        background: COLORS.ADMIN_BACKGROUND_LIGHT
    },
    rightContainer: {
        background: COLORS.RED_ORANGE
    }
})
// TODO : store PROJECTYPE const and replace occurence
const NewProject = ({onCancel}) => {
    const classes = useStyles()

    const [currentStep, setCurrentStep] = useState(3)

    const [projectName, setProjectName] = useState('')
    const [projectType, setProjectType] = useState('')
    const [projectConfig, setProjectConfig] = useState({})

    console.log("Peroject: ", projectName, projectType, projectConfig)

    return <Grid container className={classes.container}>
        <Grid item xs={12} sm={9} className={classes.leftContainer}>
            {currentStep === 1 && <Step1 onCancel={onCancel}
                                         onSubmit={(projectName) => {
                                             setCurrentStep(2)
                                             setProjectName(projectName)
                                         }}/>}
            {currentStep === 2 && <Step2 onCancel={onCancel}
                                         onSubmit={(projectType) => {
                                             setCurrentStep(3)
                                             setProjectType( projectType)
                                         }}/>}

            {currentStep === 3 && <Step3 onCancel={onCancel}
                                         projectType={projectType}
                                         onSubmit={(data) => {
                                             setProjectConfig(data)
                                         }}/>}
        </Grid>

        <Hidden xsDown>
            <Grid item sm={3} className={classes.rightContainer}>

            </Grid>
        </Hidden>
    </Grid>

}

export default NewProject
