import { Suspense, lazy } from 'react'
import { LoaderMatchParent } from '../baseComponents/customComponent/LoaderMatchParent.tsx'
import { ErrorBoundary } from '../baseComponents/customComponent/ErrorBoundary.tsx'
import { ALERT_REACT_CATCHED_ERROR_LANDING } from '../utils/alerting/alerts'
// noinspection JSCheckFunctionSignatures
const Root = lazy(() =>
    import('./Root.tsx').then((module) => ({ default: module.Root }))
)

export const SuspendedRootApp = () => {
    return (
        <ErrorBoundary errorToReport={ALERT_REACT_CATCHED_ERROR_LANDING}>
            <Suspense fallback={<LoaderMatchParent />}>
                <Root />
            </Suspense>
        </ErrorBoundary>
    )
}
