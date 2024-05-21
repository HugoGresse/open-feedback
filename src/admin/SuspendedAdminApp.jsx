import React, { Suspense, lazy } from 'react'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent.jsx'
import ErrorBoundary from '../baseComponents/customComponent/ErrorBoundary.jsx'
import { ALERT_REACT_CATCHED_ERROR_ADMIN } from '../utils/alerting/alerts'

const AdminApp = lazy(() => import('./AdminApp.jsx'))

export const SuspendedAdminApp = () => {
    return (
        <ErrorBoundary errorToReport={ALERT_REACT_CATCHED_ERROR_ADMIN}>
            <Suspense fallback={<LoaderMatchParent />}>
                <AdminApp />
            </Suspense>
        </ErrorBoundary>
    )
}
