import { getSelectedProjectSelector } from '../projectSelectors'
import { getOrganization } from '../../../organization/core/actions/getOrganization'

export const getProjectOrganizationIfPossible = () => (dispatch, getState) => {
    const project = getSelectedProjectSelector(getState())
    if (project && project.organizationId) {
        dispatch(getOrganization(project.organizationId))
    }
}
