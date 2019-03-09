import React, { Component } from 'react'
import { setFavicon } from '../feedback/layout/utils'
import Login from './auth/Login'
import { Route } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import Dashboard from './Dashboard'
import Project from './Project'

class Admin extends Component {
    componentWillMount() {
        setFavicon('/favicon-root.ico')
    }

    render() {
        const { match } = this.props
        return (
            <Login>
                <AdminLayout match={match}>
                    <Route exact path={`${match.url}`} component={Dashboard} />
                    <Route
                        exact
                        path={`${match.url}/:projectId`}
                        component={Project}
                    />
                </AdminLayout>
            </Login>
        )
    }
}

export default Admin
