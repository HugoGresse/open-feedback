import React from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import './App.css'

import Page404 from './Page404'
import SuspendedAdminApp from './admin/SuspendedAdminApp'
import FeedbackApp from './feedback/FeedbackApp'
import SuspendedRootApp from './root/SuspendedRootApp'

export const history = createBrowserHistory()

const App = () => {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={SuspendedRootApp} />
                <Route exact path="/l/:page" component={SuspendedRootApp} />
                <Redirect strict exact from="/admin" to="/admin/" />
                <Route path="/admin/" component={SuspendedAdminApp} />
                <Route path="/:projectId" component={FeedbackApp} />
                <Route component={Page404} status={404} />
            </Switch>
        </Router>
    )
}

export default App
