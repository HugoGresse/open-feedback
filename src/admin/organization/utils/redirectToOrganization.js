import { ROUTE_ORGANIZATION_SEGMENT } from '../../RoutingMap'

export const redirectToOrganization = (organizationId, history) => {
    history.push(
        `${history.location.pathname}${ROUTE_ORGANIZATION_SEGMENT}/${organizationId}`
    )
}
