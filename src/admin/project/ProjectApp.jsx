import RoutingMap, { ROUTE_EVENT_BASE } from '../RoutingMap'
import ProjectDashboard from './dashboard/Dashboard.jsx'
import Talks from './talks/Talks.jsx'
import Speakers from './speakers/Speakers.jsx'
import VotingForm from './settings/votingForm/VotingForm.jsx'
import Setup from './settings/setup/Setup.jsx'
import Project from './Project.jsx'
import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import ProjectSettings from './settings/event/ProjectSettings.jsx'
import ProjectLayout from './layout/ProjectLayout.jsx'
import { useDispatch } from 'react-redux'
import Layout404 from '../baseComponents/Layout404.jsx'
import Moderation from './moderation/Moderation.jsx'
import ProjectUsers from './settings/users/ProjectUsers.jsx'
import { getProject } from './core/actions/getProject'

const ProjectApp = () => {
    const params = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProject(null, true))
    }, [dispatch])

    return (
        <Project urlProjectId={params.projectId} key={params.projectId}>
            <ProjectLayout baseUrl={ROUTE_EVENT_BASE}>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Navigate
                            to={`${ROUTE_EVENT_BASE}/${params.projectId}${RoutingMap.dashboard.url}`}
                        />}
                    />

                    <Route
                        exact
                        path={RoutingMap.dashboard.url}
                        element={<ProjectDashboard/>}
                    />
                    <Route
                        exact
                        path={RoutingMap.talks.url}
                        element={<Talks/>}
                    />
                    <Route
                        exact
                        path={RoutingMap.speakers.url}
                        element={<Speakers/>}
                    />
                    <Route
                        exact
                        path={RoutingMap.moderation.url}
                        element={<Moderation/>}
                    />

                    <Route
                        exact
                        path={RoutingMap.settingEvent.url}
                        element={<ProjectSettings/>}
                    />

                    <Route
                        exact
                        path={RoutingMap.settingVotingform.url}
                        element={<VotingForm/>}
                    />

                    <Route
                        exact
                        path={RoutingMap.settingSetup.url}
                        element={<Setup/>}
                    />

                    <Route
                        exact
                        path={RoutingMap.settingUsers.url}
                        element={<ProjectUsers/>}
                    />

                    <Route component={Layout404} />
                </Routes>
            </ProjectLayout>
        </Project>
    )
}

export default ProjectApp
