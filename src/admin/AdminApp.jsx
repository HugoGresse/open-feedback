import React, { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'
import { setFavicon } from '../utils/dom'
import Login from './auth/Login.jsx'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import AdminRoot from './root/AdminRoot.jsx'
import Notifications from './notification/Notifications.jsx'
import {
    createTheme,
    ThemeProvider,
    StyledEngineProvider,
    responsiveFontSizes,
    adaptV4Theme,
} from '@mui/material';
import ProjectApp from './project/ProjectApp.jsx'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useSmallchat } from './project/utils/smallchat'
import { COLORS } from '../constants/colors'
import { SlidingOrganizationApp } from './organization/SlidingOrganizationApp.jsx'

const innerTheme = responsiveFontSizes(
    createTheme(adaptV4Theme({
        palette: {
            mode: 'light',
            primary: {
                light: COLORS.LIGHT_RED_ORANGE,
                main: COLORS.RED_ORANGE,
                dark: COLORS.DARK_RED_ORANGE,
                contrastText: '#fff',
                inputLabel: '#da2600',
            },
            secondary: {
                light: '#6ec6ff',
                main: '#2091eb',
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
    }))
)

export const AdminApp = () => {
    useSmallchat()

    useEffect(() => {
        setFavicon('/favicon-root.ico')
    }, [])

    const { projectId } = useParams()

    return (
        <I18nextProvider i18n={i18n}>
            <HelmetProvider>
                <Helmet>
                    <title>Admin - Open Feedback</title>
                </Helmet>
                <Login>
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={innerTheme}>
                            <Routes>
                                <Route
                                    exact
                                    path="/admin/event/"
                                    render={(props) => (
                                        <Navigate to="/admin/"/>
                                    )}
                                />

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
                                    exact
                                    path="/admin/:projectId/"
                                    render={(props) => (
                                        <Navigate to="/admin/event/:projectId"/>
                                    )}
                                />

                                <Route path="/admin/" component={AdminRoot} />
                            </Routes>
                            <SlidingOrganizationApp />

                            <Notifications />
                        </ThemeProvider>
                    </StyledEngineProvider>
                </Login>
            </HelmetProvider>
        </I18nextProvider>
    );
}
