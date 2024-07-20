import React, { Suspense, lazy } from 'react'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent.jsx'
import ErrorBoundary from '../baseComponents/customComponent/ErrorBoundary.jsx'
import { ALERT_REACT_CATCHED_ERROR_LANDING } from '../utils/alerting/alerts'
// noinspection JSCheckFunctionSignatures
const Root = lazy(() => import('./Root.jsx'))

const SuspendedAdminApp = () => {
    return (
        <ErrorBoundary errorToReport={ALERT_REACT_CATCHED_ERROR_LANDING}>
            <Suspense fallback={<LoaderMatchParent />}>
                <Root />
            </Suspense>
        </ErrorBoundary>
    )
}

export default SuspendedAdminApp
