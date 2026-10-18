import { Suspense, lazy } from 'react'
import { LoaderMatchParent } from '../baseComponents/customComponent/LoaderMatchParent.tsx'

const SuperAdminApp = lazy(() =>
    import('./SuperAdminApp.tsx').then((module) => ({
        default: module.SuperAdminApp,
    }))
)

export const SuspendedSuperAdminApp = () => {
    return (
        <Suspense fallback={<LoaderMatchParent />}>
            <SuperAdminApp />
        </Suspense>
    )
}
