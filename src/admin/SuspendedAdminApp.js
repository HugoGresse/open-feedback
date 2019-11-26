import React, { Suspense, lazy } from 'react'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent'
import ErrorBoundary from '../baseComponents/customComponent/ErrorBoundary'
// noinspection JSCheckFunctionSignatures
const AdminApp = lazy(() => import('./AdminApp'))

const SuspendedAdminApp = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoaderMatchParent />}>
                <AdminApp />
            </Suspense>
        </ErrorBoundary>
    )
}

export default SuspendedAdminApp
