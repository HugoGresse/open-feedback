import React, { useEffect } from 'react'
import { Organization } from './Organization'
import { OrganizationLayout } from './layout/OrganizationLayout'
import { createTheme, ThemeProvider } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { getOrganizations } from './core/actions/getOrganizations'
import { Redirect, Route, Switch } from 'react-router-dom'
import { OrganizationUsers } from './users/OrganizationUsers'
import { OrganizationTheme } from './theme/OrganizationTheme'
import { OrganizationVotingForm } from './votingForm/OrganizationVotingForm'

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
    const { path, url } = match

    useEffect(() => {
        dispatch(getOrganizations())
    }, [dispatch])

    return (
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
    )
}
