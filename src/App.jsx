import React from 'react'
import {
    Route,
    BrowserRouter as Router,
    Routes, Navigate,
} from 'react-router-dom'
import './App.css'

import Page404 from './Page404.jsx'
import FeedbackApp from './feedback/FeedbackApp.jsx'
import Root from './root/Root.jsx'
import { AdminApp } from './admin/AdminApp.jsx'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Root />} />
                <Route strict exact path="/admin" render={() => <Navigate to="/admin/" />} />
                <Route path="/admin/" element={<AdminApp />} />
                <Route path="/admin/*" element={<AdminApp />} />
                <Route path="/:projectId" component={FeedbackApp} />
                <Route component={Page404} status={404} />
            </Routes>
        </Router>
    )
}

export default App
