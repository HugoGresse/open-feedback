import React, { Component } from 'react'
import { setFavicon } from '../feedback/layout/utils'
import Login from './auth/Login'
import { Route } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import ProjectDashboard from './ProjectDashboard'
import ProjectAddEdit from './ProjectAddEdit'
import AdminRoot from './AdminRoot'
import Project from './Project'

class AdminApp extends Component {
    componentWillMount() {
        setFavicon('/favicon-root.ico')
    }

    render() {
        const { match } = this.props
        return (
            <Login>
                <AdminLayout match={match}>
                    <Route exact path={`${match.url}/`} component={AdminRoot} />
                    <Route
                        exact
                        path={`${match.url}/:projectId`}
                        render={props => (
                            <Project {...props}>
                                <ProjectDashboard {...props} />
                            </Project>
                        )}
                    />
                    <Route
                        exact
                        path={`${match.url}/:projectId/edit`}
                        render={props => (
                            <Project {...props}>
                                <ProjectAddEdit {...props} />
                            </Project>
                        )}
                    />
                </AdminLayout>
            </Login>
        )
    }
}

export default AdminApp
