import ReactGA from "react-ga"

const initAndTrackWithGoogleAnalytics = (history, gaID) => {
    ReactGA.initialize(gaID)

    history.listen((location) => {
        ReactGA.pageview(location.pathname)
    })

    // workaround for initial visit
    if (window.performance && (performance.navigation.type === performance.navigation.TYPE_NAVIGATE)) {
        ReactGA.pageview("/")
    }
}

export const setGAUser = (userId) => {
    ReactGA.set({ userId: userId });
}

export default initAndTrackWithGoogleAnalytics
