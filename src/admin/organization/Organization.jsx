import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent.jsx'
import Layout404 from '../baseComponents/Layout404.jsx'
import {
    getSelectedOrganizationSelector,
    isOrganizationsLoadedSelector,
} from './core/organizationSelectors'
import {
    selectOrganization,
    unselectOrganization,
} from './core/actions/selectUnselectActions'

export const Organization = ({ match, children }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(selectOrganization(match.params.organizationId))
        return () => {
            dispatch(unselectOrganization(null))
        }
    }, [dispatch, match.params.organizationId])

    const selectedOrganization = useSelector(getSelectedOrganizationSelector)
    const irOrganizationsLoaded = useSelector(isOrganizationsLoadedSelector)

    if (selectedOrganization) return children
    if (irOrganizationsLoaded && !selectedOrganization) return <Layout404 />
    return <LoaderMatchParent />
}
