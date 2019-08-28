import RoutingMap from '../RoutingMap'
import ProjectDashboard from './dashboard/ProjectDashboard'
import Talks from './talks/Talks'
import Speakers from './speakers/Speakers'
import ProjectEdit from './ProjectEdit'
import VotingForm from './settings/votingForm/VotingForm'
import Setup from './settings/setup/Setup'
import Users from './settings/users/Users'
import Project from './Project'
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

const ProjectApp = ({ match }) => {
    return (
        <Project match={match} key={match.params.projectId}>
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
                    render={props => <ProjectEdit {...props} />}
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
            </Switch>
        </Project>
    )
}

export default ProjectApp
