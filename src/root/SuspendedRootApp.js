import React, { Suspense, lazy } from 'react'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent'
import ErrorBoundary from '../baseComponents/customComponent/ErrorBoundary'
// noinspection JSCheckFunctionSignatures
const Root = lazy(() => import('./Root'))

const SuspendedAdminApp = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoaderMatchParent />}>
                <Root />
            </Suspense>
        </ErrorBoundary>
    )
}

export default SuspendedAdminApp
