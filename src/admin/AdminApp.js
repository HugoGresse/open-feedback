import React, { Component } from 'react'
import { setFavicon } from '../feedback/layout/utils'
import Login from './auth/Login'
import { Route, Switch } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import ProjectDashboard from './ProjectDashboard'
import ProjectEdit from './ProjectEdit'
import AdminRoot from './AdminRoot'
import Project from './Project'
import ProjectAdd from './ProjectAdd'

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
            </Login>
        )
    }
}

export default AdminApp
