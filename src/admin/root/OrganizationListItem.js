import React from 'react'
import ProjectList from './ProjectList'
import { OrganizationTitle } from './OrganizationTitle'
import { NO_ORGANIZATION_FAKE_ID } from '../organization/core/organizationConstants'

export const OrganizationListItem = ({
    organizationId,
    organizationName,
    projects,
    onNewEventClick,
    onProjectSelected,
}) => {
    const invertedColor = organizationId !== NO_ORGANIZATION_FAKE_ID
    return (
        <>
            <OrganizationTitle
                title={organizationName}
                invertedColor={invertedColor}
            />
            <ProjectList
                organizationId={organizationId}
                projects={projects}
                invertedColor={invertedColor}
                onNewEventClick={onNewEventClick}
                onProjectSelected={onProjectSelected}
            />
        </>
    )
}
