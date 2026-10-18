import { useSelector } from 'react-redux'
import { OFCard } from '../../../baseComponents/OFCard.tsx'
import CardContent from '@mui/material/CardContent'
import { getSelectedProjectSelector } from '../../core/projectSelectors'
import { LoaderMatchParent } from '../../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { ProjectSettingsForm } from './ProjectSettingsForm.tsx'

export const ProjectSettings = () => {
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
