import React, { useEffect } from 'react'
import { Organization } from './Organization'
import { OrganizationLayout } from './layout/OrganizationLayout'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { getOrganizations } from './core/actions/getOrganizations'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import { OrganizationUsers } from './OrganizationUsers'
import { OrganizationTheme } from './OrganizationTheme'
import { OrganizationVotingForm } from './OrganizationVotingForm'

const createOrganizationTheme = (parentTheme) =>
    createMuiTheme({
        ...parentTheme,
        palette: {
            primary: {
                ...parentTheme.palette.secondary,
            },
        },
    })

export const OrganizationApp = ({ match }) => {
    const dispatch = useDispatch()
    const { path } = useRouteMatch()

    useEffect(() => {
        dispatch(getOrganizations())
    }, [dispatch])

    return (
        <ThemeProvider theme={createOrganizationTheme}>
            <Organization match={match} key={match.params.organizationId}>
                <OrganizationLayout>
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
    )
}
