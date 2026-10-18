import { useEffect } from 'react'
import { Organization } from './Organization.tsx'
import { OrganizationLayout } from './layout/OrganizationLayout.tsx'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { getOrganizations } from './core/actions/getOrganizations'
import { Navigate, type PathMatch, Route, Routes } from 'react-router-dom'
import { OrganizationUsers } from './users/OrganizationUsers.tsx'
import { OrganizationTheme } from './theme/OrganizationTheme.tsx'
import { OrganizationVotingForm } from './votingForm/OrganizationVotingForm.tsx'
import { OrganizationIntegration } from './integration/OrganizationIntegration.tsx'
import { useAppDispatch } from '../../store'

const createOrganizationTheme = (parentTheme: Theme) =>
    createTheme({
        ...parentTheme,
        palette: {
            primary: {
                ...parentTheme.palette.secondary,
            },
        },
    })

export interface OrganizationAppProps {
    match: PathMatch<'organizationId'>
    onClose: () => void
}

export const OrganizationApp = ({ match, onClose }: OrganizationAppProps) => {
    const dispatch = useAppDispatch()
    const { pathname, pathnameBase } = match

    useEffect(() => {
        dispatch(getOrganizations())
    }, [dispatch])

    const organizationId = match.params.organizationId
    const baseUrl = `/org/${organizationId}`

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={createOrganizationTheme}>
                <Organization match={match} key={organizationId}>
                    <OrganizationLayout
                        onClose={onClose}
                        baseUrl={pathnameBase}
                    >
                        <Routes location={pathname}>
                            <Route
                                path={`${baseUrl}/users`}
                                element={<OrganizationUsers />}
                            />
                            <Route
                                path={`${baseUrl}/theme`}
                                element={<OrganizationTheme />}
                            />
                            <Route
                                path={`${baseUrl}/votingForm`}
                                element={<OrganizationVotingForm />}
                            />
                            <Route
                                path={`${baseUrl}/integration`}
                                element={<OrganizationIntegration />}
                            />
                            <Route
                                path={`${baseUrl}`}
                                element={<Navigate to={`${pathname}users`} />}
                            />
                        </Routes>
                    </OrganizationLayout>
                </Organization>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
