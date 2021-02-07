import React from 'react'
import ProjectList from './ProjectList'
import { OrganizationTitle } from './OrganizationTitle'

export const OrganizationListItem = ({
    organizationName,
    projects,
    onNewEventClick,
    onProjectSelected,
}) => {
    return (
        <>
            <OrganizationTitle title={organizationName} />
            <ProjectList
                projects={projects}
                onNewEventClick={onNewEventClick}
                onProjectSelected={onProjectSelected}
            />
        </>
    )
}
