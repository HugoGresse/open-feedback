import React, { Suspense, lazy } from 'react'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent.jsx'
import ErrorBoundary from '../baseComponents/customComponent/ErrorBoundary.jsx'
import { ALERT_REACT_CATCHED_ERROR_ADMIN } from '../utils/alerting/alerts'
// noinspection JSCheckFunctionSignatures
const AdminApp = lazy(() => import('./AdminApp.jsx'))

const SuspendedAdminApp = () => {
    return (
        <ErrorBoundary errorToReport={ALERT_REACT_CATCHED_ERROR_ADMIN}>
            <Suspense fallback={<LoaderMatchParent />}>
                <AdminApp />
            </Suspense>
        </ErrorBoundary>
    )
}

export default SuspendedAdminApp
