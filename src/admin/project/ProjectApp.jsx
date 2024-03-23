import RoutingMap, { ROUTE_EVENT_BASE } from '../RoutingMap'
import ProjectDashboard from './dashboard/Dashboard.jsx'
import Talks from './talks/Talks.jsx'
import Speakers from './speakers/Speakers.jsx'
import VotingForm from './settings/votingForm/VotingForm.jsx'
import Setup from './settings/setup/Setup.jsx'
import Project from './Project.jsx'
import React, { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import ProjectSettings from './settings/event/ProjectSettings.jsx'
import ProjectLayout from './layout/ProjectLayout.jsx'
import { useDispatch } from 'react-redux'
import Layout404 from '../baseComponents/Layout404.jsx'
import Moderation from './moderation/Moderation.jsx'
import ProjectUsers from './settings/users/ProjectUsers.jsx'
import { getProject } from './core/actions/getProject'

const ProjectApp = ({ match }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProject(null, true))
    }, [dispatch])

    return (
        <Project match={match} key={match.params.projectId}>
            <ProjectLayout baseUrl={ROUTE_EVENT_BASE}>
                <Switch>
                    <Redirect
                        exact
                        from={`${match.url}`}
                        to={`${match.url}${RoutingMap.dashboard.url}`}
                    />

                    <Route
                        exact
                        path={`${match.url}${RoutingMap.dashboard.url}`}
                        render={(props) => <ProjectDashboard {...props} />}
                    />
                    <Route
                        exact
                        path={`${match.url}${RoutingMap.talks.url}`}
                        render={(props) => <Talks {...props} />}
                    />
                    <Route
                        exact
                        path={`${match.url}${RoutingMap.speakers.url}`}
                        render={(props) => <Speakers {...props} />}
                    />
                    <Route
                        exact
                        path={`${match.url}${RoutingMap.moderation.url}`}
                        render={(props) => <Moderation {...props} />}
                    />

                    <Route
                        exact
                        path={`${match.url}${RoutingMap.settingEvent.url}`}
                        render={(props) => <ProjectSettings {...props} />}
                    />

                    <Route
                        exact
                        path={`${match.url}${RoutingMap.settingVotingform.url}`}
                        render={(props) => <VotingForm {...props} />}
                    />

                    <Route
                        exact
                        path={`${match.url}${RoutingMap.settingSetup.url}`}
                        render={(props) => <Setup {...props} />}
                    />

                    <Route
                        exact
                        path={`${match.url}${RoutingMap.settingUsers.url}`}
                        render={(props) => <ProjectUsers {...props} />}
                    />

                    <Route component={Layout404} />
                </Switch>
            </ProjectLayout>
        </Project>
    )
}

export default ProjectApp
