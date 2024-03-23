import { useSelector } from 'react-redux'
import React from 'react'
import OFCard from '../../../baseComponents/OFCard.jsx'
import CardContent from '@mui/material/CardContent'
import { getSelectedProjectSelector } from '../../core/projectSelectors'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent.jsx'
import ProjectSettingsForm from './ProjectSettingsForm.jsx'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import LuxonUtils from '@date-io/luxon'

const ProjectSettings = () => {
    const project = useSelector(getSelectedProjectSelector)

    if (!project) {
        return <LoaderMatchParent />
    }

    return (
        <OFCard>
            <CardContent>
                <MuiPickersUtilsProvider
                    utils={LuxonUtils}
                    locale={navigator.language || navigator.userLanguage}>
                    <ProjectSettingsForm project={project} />
                </MuiPickersUtilsProvider>
            </CardContent>
        </OFCard>
    )
}

export default ProjectSettings
