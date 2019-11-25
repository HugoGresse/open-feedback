import React, { useEffect } from 'react'
import { setFavicon } from '../feedback/layout/utils'
import Login from './auth/Login'
import { Route, Switch, useParams } from 'react-router-dom'
import AdminLayout from './AdminLayout'
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
    const baseUrl = '/admin'

    return (
        <Login>
            <MuiThemeProvider theme={innerTheme}>
                <Switch>
                    <Route exact path={`${baseUrl}/`} component={AdminRoot} />

                    <AdminLayout baseUrl={baseUrl}>
                        <Route
                            path={`${baseUrl}/:projectId`}
                            render={props => (
                                <ProjectApp
                                    match={props.match}
                                    key={projectId}
                                />
                            )}
                        />
                    </AdminLayout>
                </Switch>

                <Notifications />
            </MuiThemeProvider>
        </Login>
    )
}

export default AdminApp
