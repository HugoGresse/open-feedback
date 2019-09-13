import ReactGA from 'react-ga'

const options = {}

const trackPage = page => {
    ReactGA.set({
        page,
        ...options
    })
    ReactGA.pageview(page)
}

let currentPage = ''

export const googleAnalytics = store => next => action => {
    if (action.type === '@@router/LOCATION_CHANGE') {
        const nextPage = `${action.payload.location.pathname}${action.payload.location.search}`

        if (currentPage !== nextPage) {
            currentPage = nextPage
            trackPage(nextPage)
        }
    }

    return next(action)
}

export const initGA = () => {
    if (process.env.NODE_ENV === 'development') {
        return
    }

    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS)
}
