import React, { useEffect } from 'react'
import { Organization } from './Organization.jsx'
import { OrganizationLayout } from './layout/OrganizationLayout.jsx'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { useDispatch } from 'react-redux'
import { getOrganizations } from './core/actions/getOrganizations'
import { Navigate, Route, Routes } from 'react-router-dom'
import { OrganizationUsers } from './users/OrganizationUsers.jsx'
import { OrganizationTheme } from './theme/OrganizationTheme.jsx'
import { OrganizationVotingForm } from './votingForm/OrganizationVotingForm.jsx'

const createOrganizationTheme = (parentTheme) =>
    createTheme({
        ...parentTheme,
        palette: {
            primary: {
                ...parentTheme.palette.secondary,
            },
        },
    })

export const OrganizationApp = ({ match, onClose }) => {
    const dispatch = useDispatch()
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
                    <OrganizationLayout onClose={onClose} baseUrl={pathnameBase}>
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
                                path={`${baseUrl}/`}
                                element={<Navigate to={`${pathname}/users`} />}
                            />
                        </Routes>
                    </OrganizationLayout>
                </Organization>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
