import {
    Route,
    BrowserRouter as Router,
    Routes,
    Navigate,
} from 'react-router-dom'
import './App.css'

import { Page404 } from './Page404.tsx'
import { FeedbackApp } from './feedback/FeedbackApp.tsx'
import { SuspendedAdminApp } from './admin/SuspendedAdminApp.tsx'
import { SuspendedRootApp } from './root/SuspendedRootApp.tsx'
import { SuspendedSuperAdminApp } from './superAdmin/SuspendedSuperAdminApp.tsx'

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<SuspendedRootApp />} />
                <Route
                    strict
                    exact
                    path="/admin"
                    render={() => <Navigate to="/admin/" />}
                />
                <Route path="/admin/" element={<SuspendedAdminApp />} />
                <Route path="/admin//*" element={<SuspendedAdminApp />} />
                <Route
                    path="/superadmin/"
                    element={<SuspendedSuperAdminApp />}
                />
                <Route path="/:projectId//*" element={<FeedbackApp />} />
                <Route component={Page404} status={404} />
            </Routes>
        </Router>
    )
}
