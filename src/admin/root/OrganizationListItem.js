import React from 'react'
import ProjectList from './ProjectList'
import { OrganizationHeader } from './OrganizationHeader'
import { NO_ORGANIZATION_FAKE_ID } from '../organization/core/organizationConstants'

export const OrganizationListItem = ({
    organizationId,
    organizationName,
    projects,
    onNewEventClick,
    onProjectSelected,
}) => {
    const isOrganization = organizationId !== NO_ORGANIZATION_FAKE_ID
    return (
        <>
            <OrganizationHeader
                title={organizationName}
                isOrganization={isOrganization}
            />
            <ProjectList
                organizationId={organizationId}
                projects={projects}
                invertedColor={isOrganization}
                onNewEventClick={onNewEventClick}
                onProjectSelected={onProjectSelected}
            />
        </>
    )
}
