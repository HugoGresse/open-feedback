import { Suspense, lazy } from 'react'
import { LoaderMatchParent } from '../baseComponents/customComponent/LoaderMatchParent.tsx'
import { ErrorBoundary } from '../baseComponents/customComponent/ErrorBoundary.tsx'
import { ALERT_REACT_CATCHED_ERROR_ADMIN } from '../utils/alerting/alerts'

const AdminApp = lazy(() =>
    import('./AdminApp.tsx').then((module) => ({ default: module.AdminApp }))
)

export const SuspendedAdminApp = () => {
    return (
        <ErrorBoundary errorToReport={ALERT_REACT_CATCHED_ERROR_ADMIN}>
            <Suspense fallback={<LoaderMatchParent />}>
                <AdminApp />
            </Suspense>
        </ErrorBoundary>
    )
}
