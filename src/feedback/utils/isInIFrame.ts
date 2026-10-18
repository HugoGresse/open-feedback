export const isInIFrame = () => {
    try {
        return window.self !== window.top
    } catch {
        return true
    }
}
