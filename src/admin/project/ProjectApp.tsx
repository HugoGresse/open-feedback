import { ROUTE_EVENT_BASE, RoutingMap } from '../RoutingMap'
import { Dashboard } from './dashboard/Dashboard.tsx'
import { Talks } from './talks/Talks.tsx'
import { Speakers } from './speakers/Speakers.tsx'
import { VotingForm } from './settings/votingForm/VotingForm.tsx'
import { Setup } from './settings/setup/Setup.tsx'
import { Project } from './Project.tsx'
import { useEffect } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { ProjectSettings } from './settings/event/ProjectSettings.tsx'
import { ProjectLayout } from './layout/ProjectLayout.tsx'
import { useDispatch } from 'react-redux'
import { Layout404 } from '../baseComponents/Layout404.tsx'
import { Moderation } from './moderation/Moderation.tsx'
import { ProjectUsers } from './settings/users/ProjectUsers.tsx'
import { Integration } from './settings/integration/Integration.tsx'
import { getProject } from './core/actions/getProject'

export const ProjectApp = () => {
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
                        element={
                            <Navigate
                                to={`${ROUTE_EVENT_BASE}/${params.projectId}${RoutingMap.dashboard.url}`}
                            />
                        }
                    />

                    <Route
                        exact
                        path={RoutingMap.dashboard.url}
                        element={<Dashboard />}
                    />
                    <Route
                        exact
                        path={RoutingMap.talks.url}
                        element={<Talks />}
                    />
                    <Route
                        exact
                        path={RoutingMap.speakers.url}
                        element={<Speakers />}
                    />
                    <Route
                        exact
                        path={RoutingMap.moderation.url}
                        element={<Moderation />}
                    />

                    <Route
                        exact
                        path={RoutingMap.settingEvent.url}
                        element={<ProjectSettings />}
                    />

                    <Route
                        exact
                        path={RoutingMap.settingVotingform.url}
                        element={<VotingForm />}
                    />

                    <Route
                        exact
                        path={RoutingMap.settingSetup.url}
                        element={<Setup />}
                    />

                    <Route
                        exact
                        path={RoutingMap.settingUsers.url}
                        element={<ProjectUsers />}
                    />

                    <Route
                        exact
                        path={RoutingMap.settingIntegration.url}
                        element={<Integration />}
                    />

                    <Route component={Layout404} />
                </Routes>
            </ProjectLayout>
        </Project>
    )
}
