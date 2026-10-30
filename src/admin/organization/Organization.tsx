import { type ReactNode, useEffect } from 'react'
import type { PathMatch } from 'react-router-dom'
import { LoaderMatchParent } from '../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { Layout404 } from '../baseComponents/Layout404.tsx'
import {
    getSelectedOrganizationIdSelector,
    getSelectedOrganizationSelector,
    isOrganizationsLoadedSelector,
} from './core/organizationSelectors'
import {
    selectOrganization,
    unselectOrganization,
} from './core/actions/selectUnselectActions'
import { useAppDispatch, useAppSelector } from '../../store'

export interface OrganizationProps {
    match: PathMatch<'organizationId'>
    children?: ReactNode
}

export const Organization = ({ match, children }: OrganizationProps) => {
    const dispatch = useAppDispatch()
    // Always set: the route pattern is /admin/org/:organizationId/*
    const organizationId = match.params.organizationId as string

    useEffect(() => {
        dispatch(selectOrganization(organizationId))
        return () => {
            dispatch(unselectOrganization())
        }
    }, [dispatch, organizationId])

    const selectedOrganizationId = useAppSelector(
        getSelectedOrganizationIdSelector
    )
    const selectedOrganization = useAppSelector(getSelectedOrganizationSelector)
    const irOrganizationsLoaded = useAppSelector(isOrganizationsLoadedSelector)

    if (selectedOrganization) return children
    // Not selected yet, or unselected once deleted (until the modal closes)
    if (!selectedOrganizationId) return <LoaderMatchParent />
    if (irOrganizationsLoaded) return <Layout404 />
    return <LoaderMatchParent />
}
