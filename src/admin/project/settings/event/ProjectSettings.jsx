import { useSelector } from 'react-redux'
import React from 'react'
import OFCard from '../../../baseComponents/OFCard.jsx'
import CardContent from '@mui/material/CardContent'
import { getSelectedProjectSelector } from '../../core/projectSelectors'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent.jsx'
import ProjectSettingsForm from './ProjectSettingsForm.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTime } from 'luxon'

const ProjectSettings = () => {
    const project = useSelector(getSelectedProjectSelector)

    if (!project) {
        return <LoaderMatchParent />
    }

    return (
        <OFCard>
            <CardContent>
                <LocalizationProvider
                    adapterLocale={DateTime.now().resolvedLocaleOptions().locale}
                    dateAdapter={AdapterLuxon}>
                    <ProjectSettingsForm project={project} />
                </LocalizationProvider>
            </CardContent>
        </OFCard>
    )
}

export default ProjectSettings
