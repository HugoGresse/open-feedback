import React, { Suspense, lazy } from 'react'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent.tsx'

const SuperAdminApp = lazy(() => import('./SuperAdminApp.tsx'))

export const SuspendedSuperAdminApp = () => {
    return (
        <Suspense fallback={<LoaderMatchParent />}>
            <SuperAdminApp />
        </Suspense>
    )
}
