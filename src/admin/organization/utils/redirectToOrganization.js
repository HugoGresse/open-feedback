import { ROUTE_ORGANIZATION_SEGMENT } from '../../RoutingMap'

export const redirectToOrganization = (organizationId, navigate) => {
    navigate(
        `${window.location.pathname}${ROUTE_ORGANIZATION_SEGMENT}/${organizationId}`
    )
}
