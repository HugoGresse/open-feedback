import React, { Component } from 'react'
import { setFavicon } from '../feedback/layout/utils'
import Login from './auth/Login'
import { Route, Switch } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import ProjectDashboard from './project/dashboard/ProjectDashboard'
import ProjectEdit from './project/ProjectEdit'
import AdminRoot from './AdminRoot'
import Project from './project/Project'
import ProjectAdd from './project/new/ProjectNew'
import Notifications from './notification/Notifications'

class AdminApp extends Component {
    componentWillMount() {
        setFavicon('/favicon-root.ico')
    }

    render() {
        const { match } = this.props
        return (
            <Login>
                <AdminLayout match={match}>
                    <Switch>
                        <Route
                            exact
                            path={`${match.url}/`}
                            component={AdminRoot}
                        />

                        <Route
                            exact
                            path={`${match.url}/newProject`}
                            render={props => (
                                <ProjectAdd {...props} create={true} />
                            )}
                        />

                        <Route
                            exact
                            path={`${match.url}/:projectId`}
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
                            path={`${match.url}/:projectId/edit`}
                            render={props => (
                                <Project
                                    {...props}
                                    key={props.match.params.projectId}
                                >
                                    <ProjectEdit {...props} />
                                </Project>
                            )}
                        />
                    </Switch>
                </AdminLayout>
                <Notifications />
            </Login>
        )
    }
}

export default AdminApp
