import {useSelector} from 'react-redux'
import React from 'react'
import OFCard from '../../../baseComponents/OFCard'
import CardContent from '@material-ui/core/CardContent'
import {getSelectedProjectSelector} from '../../core/projectSelectors'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent'
import ProjectSettingsForm from './ProjectSettingsForm'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment'

const ProjectSettings = () => {
    const project = useSelector(getSelectedProjectSelector)

    if (!project) {
        return <LoaderMatchParent/>
    }

    return (
        <OFCard>
            <CardContent>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <ProjectSettingsForm project={project}/>
                </MuiPickersUtilsProvider>
            </CardContent>
        </OFCard>
    )
}

export default ProjectSettings
