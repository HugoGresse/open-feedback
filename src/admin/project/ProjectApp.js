import RoutingMap from '../RoutingMap'
import ProjectDashboard from './dashboard/Dashboard'
import Talks from './talks/Talks'
import Speakers from './speakers/Speakers'
import VotingForm from './settings/votingForm/VotingForm'
import Setup from './settings/setup/Setup'
import Users from './settings/users/Users'
import Project from './Project'
import React, { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import ProjectSettings from './settings/event/ProjectSettings'
import ProjectLayout from './layout/ProjectLayout'
import { useDispatch } from 'react-redux'
import { getProjects } from './core/projectActions'
import Layout404 from './layout/Layout404'

const ProjectApp = ({ match }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProjects())
    }, [dispatch])

    return (
        <Project match={match} key={match.params.projectId}>
            <ProjectLayout baseUrl="/admin">
                <Switch>
                    <Redirect
                        exact
                        from={`${match.url}`}
                        to={`${match.url}${RoutingMap.dashboard.url}`}
                    />

                    <Route
                        exact
                        path={`${match.url}${RoutingMap.dashboard.url}`}
                        render={props => <ProjectDashboard {...props} />}
                    />
                    <Route
                        exact
                        path={`${match.url}${RoutingMap.talks.url}`}
                        render={props => <Talks {...props} />}
                    />
                    <Route
                        exact
                        path={`${match.url}${RoutingMap.speakers.url}`}
                        render={props => <Speakers {...props} />}
                    />

                    <Route
                        exact
                        path={`${match.url}${RoutingMap.settingEvent.url}`}
                        render={props => <ProjectSettings {...props} />}
                    />

                    <Route
                        exact
                        path={`${match.url}${RoutingMap.settingVotingform.url}`}
                        render={props => <VotingForm {...props} />}
                    />

                    <Route
                        exact
                        path={`${match.url}${RoutingMap.settingSetup.url}`}
                        render={props => <Setup {...props} />}
                    />

                    <Route
                        exact
                        path={`${match.url}${RoutingMap.settingUsers.url}`}
                        render={props => <Users {...props} />}
                    />

                    <Route component={Layout404} />
                </Switch>
            </ProjectLayout>
        </Project>
    )
}

export default ProjectApp
