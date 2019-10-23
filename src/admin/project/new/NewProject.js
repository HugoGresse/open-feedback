import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import {COLORS} from '../../../constants/colors'
import Hidden from '@material-ui/core/Hidden'
import Step1 from './Step1'
import Step2 from './Step2'

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

const NewProject = ({onCancel}) => {
    const classes = useStyles()

    const [currentStep, setCurrentStep] = useState(1)
    const [projectData, setProjectData] = useState({
        projectName: '',
        projectType: ''
    })

    console.log("Peroject: ", projectData)

    return <Grid container className={classes.container}>
        <Grid item xs={12} sm={9} className={classes.leftContainer}>
            {currentStep === 1 && <Step1 onCancel={onCancel}
                                         onSubmit={(projectName) => {
                                             setCurrentStep(2)
                                             setProjectData({projectName: projectName})
                                         }}/>}
            {currentStep === 2 && <Step2 onCancel={onCancel}
                                         onSubmit={(projectType) => {
                                             setCurrentStep(2)
                                             setProjectData({projectType: projectType})
                                         }}/>}
        </Grid>

        <Hidden xsDown>
            <Grid item sm={3} className={classes.rightContainer}>

            </Grid>
        </Hidden>
    </Grid>

}

export default NewProject
