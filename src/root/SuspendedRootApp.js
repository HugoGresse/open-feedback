import React, { Suspense, lazy } from 'react'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent'
import ErrorBoundary from '../baseComponents/customComponent/ErrorBoundary'
import { ALERT_REACT_CATCHED_ERROR_LANDING } from '../utils/alerting/alerts'
// noinspection JSCheckFunctionSignatures
const Root = lazy(() => import('./RootApp'))

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
