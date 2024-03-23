import React, { useEffect } from 'react'
import { Organization } from './Organization.jsx'
import { OrganizationLayout } from './layout/OrganizationLayout.jsx'
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material';
import { useDispatch } from 'react-redux'
import { getOrganizations } from './core/actions/getOrganizations'
import { Redirect, Route, Switch } from 'react-router-dom'
import { OrganizationUsers } from './users/OrganizationUsers.jsx'
import { OrganizationTheme } from './theme/OrganizationTheme.jsx'
import { OrganizationVotingForm } from './votingForm/OrganizationVotingForm.jsx'

const createOrganizationTheme = (parentTheme) =>
    createTheme(adaptV4Theme({
        ...parentTheme,
        palette: {
            primary: {
                ...parentTheme.palette.secondary,
            },
        },
    }))

export const OrganizationApp = ({ match, onClose }) => {
    const dispatch = useDispatch()
    const { path, url } = match

    useEffect(() => {
        dispatch(getOrganizations())
    }, [dispatch])

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={createOrganizationTheme}>
                <Organization match={match} key={match.params.organizationId}>
                    <OrganizationLayout onClose={onClose} baseUrl={url}>
                        <Switch>
                            <Route
                                exacte
                                path={`${path}/users`}
                                component={OrganizationUsers}
                            />
                            <Route
                                exacte
                                path={`${path}/theme`}
                                component={OrganizationTheme}
                            />
                            <Route
                                exacte
                                path={`${path}/votingForm`}
                                component={OrganizationVotingForm}
                            />

                            <Redirect from={path} to={`${path}/users`} />
                        </Switch>
                    </OrganizationLayout>
                </Organization>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
