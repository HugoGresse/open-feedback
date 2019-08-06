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
                            path={`${match.url}/:projectId/dashboard`}
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
                            path={`${match.url}/:projectId/talks`}
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
                            path={`${match.url}/:projectId/speakers`}
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
                            path={`${match.url}/:projectId/settings/event`}
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
                            path={`${match.url}/:projectId/settings/votingform`}
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
                            path={`${match.url}/:projectId/settings/setup`}
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
                            path={`${match.url}/:projectId/settings/users`}
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
            </Login>
        )
    }
}

export default AdminApp
