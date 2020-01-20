import React, { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { setFavicon } from '../feedback/layout/utils'
import Login from './auth/Login'
import { Route, Switch, useParams } from 'react-router-dom'
import AdminRoot from './root/AdminRoot'
import Notifications from './notification/Notifications'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import ProjectApp from './project/ProjectApp'

const innerTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: {
            light: '#ff9c76',
            main: '#ff6a49',
            dark: '#c6381e',
            contrastText: '#fff',
        },
        secondary: {
            light: '#515151',
            main: '#292929',
            dark: '#000000',
            contrastText: '#fff',
        },
    },
})

const AdminApp = () => {
    useEffect(() => {
        setFavicon('/favicon-root.ico')
    }, [])

    const { projectId } = useParams()

    return (
        <I18nextProvider i18n={i18n}>
            <Login>
                <MuiThemeProvider theme={innerTheme}>
                    <Switch>
                        <Route exact path="/admin/" component={AdminRoot} />

                        <Route
                            path="/admin/:projectId"
                            render={props => (
                                <ProjectApp
                                    match={props.match}
                                    key={projectId}
                                />
                            )}
                        />
                    </Switch>

                    <Notifications />
                </MuiThemeProvider>
            </Login>
        </I18nextProvider>
    )
}

export default AdminApp
