import React from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import initAndTrackWithGoogleAnalytics from './utils/google-analytics/GoogleAnalytics'
import './App.css'

import Page404 from './Page404'
import SuspendedAdminApp from './admin/SuspendedAdminApp'
import FeedbackApp from './feedback/FeedbackApp'
import SuspendedRootApp from './root/SuspendedRootApp'

export const history = createBrowserHistory()

initAndTrackWithGoogleAnalytics(history, process.env.REACT_APP_GOOGLE_ANALYTICS)

const App = () => {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={SuspendedRootApp} />
                <Redirect strict exact from="/admin" to="/admin/" />
                <Route path="/admin/" component={SuspendedAdminApp} />
                <Route path="/:projectId" component={FeedbackApp} />
                <Route component={Page404} />
            </Switch>
        </Router>
    )
}

export default App
