import React from 'react'
import {
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom'
import './App.css'

import Page404 from './Page404'
import SuspendedAdminApp from './admin/SuspendedAdminApp'
import FeedbackApp from './feedback/FeedbackApp'
import SuspendedRootApp from './root/SuspendedRootApp'

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={SuspendedRootApp} />
                <Redirect strict exact from="/admin" to="/admin/" />
                <Route path="/admin/" component={SuspendedAdminApp} />
                <Route path="/:projectId" component={FeedbackApp} />
                <Route component={Page404} status={404} />
            </Switch>
        </Router>
    )
}

export default App
