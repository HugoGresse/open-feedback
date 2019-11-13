import React from 'react'
import {Typography} from '@material-ui/core'
import {useDispatch, useSelector} from 'react-redux'
import Box from '@material-ui/core/Box'
import SetupJSON from '../../setupTypeForms/SetupJSON'
import SetupTypeBox from './SetupTypeBox'
import {getSelectedProjectSelector} from '../../core/projectSelectors'
import {
    PROJECT_TYPE_HOVERBOARDV2,
    PROJECT_TYPE_JSONURL,
    PROJECT_TYPE_OPENFEEDBACK
} from '../../../../core/setupType/projectApi'
import SetupHoverboardv2 from '../../setupTypeForms/SetupHoverboardv2'
import {editProject} from '../../core/projectActions'

const SetupForm = () => {
    const dispatch = useDispatch()
    const project = useSelector(getSelectedProjectSelector)

    let setupTypeComponent

    switch (project.setupType) {
        case PROJECT_TYPE_HOVERBOARDV2:
            setupTypeComponent = <SetupHoverboardv2
                submitText="Save"
                leftColumnTitle="Config"
                rightColumnTitle="Validation"
                initialValues={
                    {
                        projectId: project.config.projectId,
                        apiKey: project.config.apiKey,
                        databaseURL: project.config.databaseURL
                    }
                }
                onSubmit={(values) => dispatch(editProject({
                    config: values
                }))}
            />
            break
        case PROJECT_TYPE_JSONURL:
            setupTypeComponent = <SetupJSON
                submitText="Save"
                leftColumnTitle="Config"
                rightColumnTitle="Validation"
                initialValues={
                    {
                        jsonUrl: project.config.jsonUrl
                    }
                }
                onSubmit={(values) => dispatch(editProject({
                    config: values
                }))}
            />
            break
        default:
            setupTypeComponent = <p>Not developed</p>
            break
    }

    return (
        <>
            <Box marginBottom={2}>
                <Typography variant="h5">
                    Setup Mode
                </Typography>
                <Typography>
                    You cannot change the setup mode after creating the project.
                </Typography>
            </Box>
            <Box display="flex"
                 flexWrap="wrap"
                 marginBottom={2}>
                <SetupTypeBox
                    title="Hoverboard v2 Firestore"
                    isSelected={project.setupType === PROJECT_TYPE_HOVERBOARDV2}/>
                <SetupTypeBox
                    title="Link to JSON file"
                    isSelected={project.setupType === PROJECT_TYPE_JSONURL}/>
                <SetupTypeBox
                    title="OpenFeedback Database"
                    isSelected={project.setupType === PROJECT_TYPE_OPENFEEDBACK}/>
            </Box>
            {setupTypeComponent}
        </>
    )
}

export default SetupForm
