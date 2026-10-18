import { ROUTE_EVENT_SEGMENT } from '../../RoutingMap'

export const redirectToProject = (currentProjectId, newProjectId, navigate) => {
    if (newProjectId === currentProjectId) {
        return
    }

    // If we have to switch the project at runtime
    if (
        currentProjectId &&
        window.location.pathname.includes(currentProjectId)
    ) {
        const redirectUrl = window.location.pathname.replace(
            currentProjectId,
            newProjectId
        )

        navigate(redirectUrl)
    } else if (
        !currentProjectId &&
        window.location.pathname.includes(newProjectId)
    ) {
        // No nothing, hard refresh, id in url but not in states
    } else {
        navigate(
            `${window.location.pathname}${ROUTE_EVENT_SEGMENT}/${newProjectId}`
        )
    }
}
