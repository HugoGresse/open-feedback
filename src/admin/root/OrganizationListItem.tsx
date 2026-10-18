import { ProjectList } from './ProjectList.tsx'
import { OrganizationHeader } from './OrganizationHeader.tsx'
import { NO_ORGANIZATION_FAKE_ID } from '../organization/core/organizationConstants'
import type { Project } from '../../core/models'

interface OrganizationListItemProps {
    organizationId: string
    organizationName: string
    projects: Project[]
    onNewEventClick: (organizationId: string) => void
}

export const OrganizationListItem = ({
    organizationId,
    organizationName,
    projects,
    onNewEventClick,
}: OrganizationListItemProps) => {
    const isOrganization = organizationId !== NO_ORGANIZATION_FAKE_ID
    return (
        <>
            <OrganizationHeader
                title={organizationName}
                isOrganization={isOrganization}
                organizationId={organizationId}
            />
            <ProjectList
                organizationId={organizationId}
                projects={projects}
                invertedColor={isOrganization}
                onNewEventClick={onNewEventClick}
            />
        </>
    )
}
