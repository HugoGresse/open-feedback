import type { NavigateFunction } from 'react-router-dom'
import { ROUTE_EVENT_SEGMENT } from '../../RoutingMap'

/**
 * The url to open the new project from the current pathname, or null to stay.
 * Project ids are matched as whole path segments: a short id like "min" is
 * also a substring of "/admin/".
 */
export const getProjectRedirectUrl = (
    pathname: string,
    currentProjectId: string | null | undefined,
    newProjectId: string
): string | null => {
    if (newProjectId === currentProjectId) {
        return null
    }
    const segments = pathname.split('/')

    // If we have to switch the project at runtime
    if (currentProjectId && segments.includes(currentProjectId)) {
        return segments
            .map((segment) =>
                segment === currentProjectId ? newProjectId : segment
            )
            .join('/')
    }
    if (!currentProjectId && segments.includes(newProjectId)) {
        // No nothing, hard refresh, id in url but not in states
        return null
    }
    return `${pathname}${ROUTE_EVENT_SEGMENT}/${newProjectId}`
}

export const redirectToProject = (
    currentProjectId: string | null | undefined,
    newProjectId: string,
    navigate: NavigateFunction
): void => {
    const url = getProjectRedirectUrl(
        window.location.pathname,
        currentProjectId,
        newProjectId
    )
    if (url) {
        navigate(url)
    }
}
