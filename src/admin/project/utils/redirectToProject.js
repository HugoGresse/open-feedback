export const redirectToProject = (currentProjectId, newProjectId, history) => {
    if (newProjectId === currentProjectId) {
        return
    }

    // If we have switch the project at runtime
    if (
        currentProjectId &&
        history.location.pathname.includes(currentProjectId)
    ) {
        const redirectUrl = history.location.pathname.replace(
            currentProjectId,
            newProjectId
        )

        history.push(redirectUrl)
    } else if (
        !currentProjectId &&
        history.location.pathname.includes(newProjectId)
    ) {
        // No nothing, hard refresh, id in url but not in states
    } else {
        history.push(`${history.location.pathname}${newProjectId}`)
    }
}
