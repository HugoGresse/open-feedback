import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
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
                <Route path="/" element={<SuspendedRootApp />} />
                <Route path="/admin/" element={<SuspendedAdminApp />} />
                <Route path="/admin//*" element={<SuspendedAdminApp />} />
                <Route
                    path="/superadmin/"
                    element={<SuspendedSuperAdminApp />}
                />
                <Route path="/:projectId//*" element={<FeedbackApp />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </Router>
    )
}
