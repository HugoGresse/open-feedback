import type { NavigateFunction } from 'react-router-dom'
import { ROUTE_ORGANIZATION_SEGMENT } from '../../RoutingMap'

export const redirectToOrganization = (
    organizationId: string,
    navigate: NavigateFunction
) => {
    navigate(
        `${window.location.pathname}${ROUTE_ORGANIZATION_SEGMENT}/${organizationId}`
    )
}
