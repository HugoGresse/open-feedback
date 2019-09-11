import { useSelector } from 'react-redux'
import React from 'react'
import OFCard from '../../../baseComponents/OFCard'
import CardContent from '@material-ui/core/CardContent'
import { getSelectedProjectSelector } from '../../core/projectSelectors'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent'
import ProjectSettingsForm from './ProjectSettingsForm'

const ProjectSettings = () => {
    const project = useSelector(getSelectedProjectSelector)

    if (!project) {
        return <LoaderMatchParent />
    }

    return (
        <OFCard>
            <CardContent>
                <ProjectSettingsForm project={project} />
            </CardContent>
        </OFCard>
    )
}

export default ProjectSettings
