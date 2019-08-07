import React, { Component } from 'react'
import { setFavicon } from '../feedback/layout/utils'
import Login from './auth/Login'
import { Route, Switch } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import ProjectDashboard from './project/dashboard/ProjectDashboard'
import ProjectEdit from './project/ProjectEdit'
import AdminRoot from './AdminRoot'
import Project from './project/Project'
import Notifications from './notification/Notifications'
import Talks from './project/talks/Talks'
import Speakers from './project/speakers/Speakers'
import VotingForm from './project/settings/votingForm/VotingForm'
import Users from './project/settings/users/Users'
import Setup from './project/settings/setup/Setup'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import RoutingMap from './RoutingMap'

const innerTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            light: '#ff9c76',
            main: '#ff6a49',
            dark: '#c6381e',
            contrastText: '#fff'
        },
        secondary: {
            light: '#515151',
            main: '#292929',
            dark: '#000000',
            contrastText: '#fff'
        }
    }
})

class AdminApp extends Component {
    componentWillMount() {
        setFavicon('/favicon-root.ico')
    }

    render() {
        const { match } = this.props
        return (
            <Login>
                <MuiThemeProvider theme={innerTheme}>
                    <AdminLayout match={match}>
                        <Switch>
                            <Route
                                exact
                                path={`${match.url}/`}
                                component={AdminRoot}
                            />

                            <Route
                                exact
                                path={`${match.url}/:projectId${RoutingMap.dashboard.url}`}
                                render={props => (
                                    <Project
                                        {...props}
                                        key={props.match.params.projectId}
                                    >
                                        <ProjectDashboard {...props} />
                                    </Project>
                                )}
                            />
                            <Route
                                exact
                                path={`${match.url}/:projectId${RoutingMap.talks.url}`}
                                render={props => (
                                    <Project
                                        {...props}
                                        key={props.match.params.projectId}
                                    >
                                        <Talks {...props} />
                                    </Project>
                                )}
                            />

                            <Route
                                exact
                                path={`${match.url}/:projectId${RoutingMap.speakers.url}`}
                                render={props => (
                                    <Project
                                        {...props}
                                        key={props.match.params.projectId}
                                    >
                                        <Speakers {...props} />
                                    </Project>
                                )}
                            />

                            <Route
                                exact
                                path={`${match.url}/:projectId${RoutingMap.settingEvent.url}`}
                                render={props => (
                                    <Project
                                        {...props}
                                        key={props.match.params.projectId}
                                    >
                                        <ProjectEdit {...props} />
                                    </Project>
                                )}
                            />

                            <Route
                                exact
                                path={`${match.url}/:projectId${RoutingMap.settingVotingform.url}`}
                                render={props => (
                                    <Project
                                        {...props}
                                        key={props.match.params.projectId}
                                    >
                                        <VotingForm {...props} />
                                    </Project>
                                )}
                            />

                            <Route
                                exact
                                path={`${match.url}/:projectId${RoutingMap.settingSetup.url}`}
                                render={props => (
                                    <Project
                                        {...props}
                                        key={props.match.params.projectId}
                                    >
                                        <Setup {...props} />
                                    </Project>
                                )}
                            />

                            <Route
                                exact
                                path={`${match.url}/:projectId${RoutingMap.settingUsers.url}`}
                                render={props => (
                                    <Project
                                        {...props}
                                        key={props.match.params.projectId}
                                    >
                                        <Users {...props} />
                                    </Project>
                                )}
                            />
                        </Switch>
                    </AdminLayout>
                    <Notifications />
                </MuiThemeProvider>
            </Login>
        )
    }
}

export default AdminApp
