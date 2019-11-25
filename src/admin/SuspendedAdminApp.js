import React, { Suspense, lazy } from 'react'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent'
import ErrorBoundaryWithGame from '../baseComponents/customComponent/ErrorBoundaryWithGame'
// noinspection JSCheckFunctionSignatures
const AdminApp = lazy(() => import('./AdminApp'))

const SuspendedAdminApp = () => {
    return (
        <ErrorBoundaryWithGame>
            <Suspense fallback={<LoaderMatchParent />}>
                <AdminApp />
            </Suspense>
        </ErrorBoundaryWithGame>
    )
}

export default SuspendedAdminApp
