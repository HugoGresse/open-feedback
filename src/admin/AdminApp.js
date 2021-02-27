import React, { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'
import { setFavicon } from '../utils/dom'
import Login from './auth/Login'
import { Redirect, Route, Switch, useParams } from 'react-router-dom'
import AdminRoot from './root/AdminRoot'
import Notifications from './notification/Notifications'
import {
    createMuiTheme,
    MuiThemeProvider,
    responsiveFontSizes,
} from '@material-ui/core'
import ProjectApp from './project/ProjectApp'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useSmallchat } from './project/utils/smallchat'
import { OrganizationApp } from './organization/OrganizationApp'
import { COLORS } from '../constants/colors'

const innerTheme = responsiveFontSizes(
    createMuiTheme({
        palette: {
            type: 'light',
            primary: {
                light: COLORS.LIGHT_RED_ORANGE,
                main: COLORS.RED_ORANGE,
                dark: COLORS.DARK_RED_ORANGE,
                contrastText: '#fff',
            },
            secondary: {
                light: '#6ec6ff',
                main: '#2196f3',
                dark: '#0069c0',
                contrastText: '#fff',
                buttonSecondaryBackground: '#fff',
                buttonSecondaryText: '#111',
            },
        },
        typography: {
            h2: {
                fontSize: 40,
            },
            h3: {
                fontSize: 28,
            },
        },
    })
)

const AdminApp = () => {
    useSmallchat()

    useEffect(() => {
        setFavicon('/favicon-root.ico')
    }, [])

    const { projectId, organizationId } = useParams()

    return (
        <I18nextProvider i18n={i18n}>
            <HelmetProvider>
                <Helmet>
                    <title>Admin - Open Feedback</title>
                </Helmet>
                <Login>
                    <MuiThemeProvider theme={innerTheme}>
                        <Switch>
                            <Route exact path="/admin/" component={AdminRoot} />

                            <Redirect exact from="/admin/event/" to="/admin/" />

                            <Route
                                path="/admin/event/:projectId"
                                render={(props) => (
                                    <ProjectApp
                                        match={props.match}
                                        key={projectId}
                                    />
                                )}
                            />
                            <Route
                                path="/admin/org/:organizationId"
                                render={(props) => (
                                    <OrganizationApp
                                        match={props.match}
                                        key={organizationId}
                                    />
                                )}
                            />

                            {/* v0.23 migration when organization is introduced*/}
                            <Redirect
                                from="/admin/:projectId"
                                to="/admin/event/:projectId"
                            />
                        </Switch>

                        <Notifications />
                    </MuiThemeProvider>
                </Login>
            </HelmetProvider>
        </I18nextProvider>
    )
}

export default AdminApp
