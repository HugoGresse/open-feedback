import React, { useEffect, useState } from 'react'
import {
    getSortedProjectsSelector,
    isProjectsLoadedSelector,
} from '../project/core/projectSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { getProjects, selectProject } from '../project/core/projectActions'
import RootHeader from './RootHeader'
import { Box, Slide } from '@material-ui/core'
import COLORS from '../../constants/colors'
import ProjectList from './ProjectList'
import NewProject from '../project/new/NewProject'
import useQuery from '../../utils/useQuery'
import ProjectInviteDialog from './ProjectInviteDialog'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { isUserValidSelector } from '../auth/authSelectors'
import RootContentLayout from './RootContentLayout'
import EmailNotVerified from '../auth/EmailNotVerified'
import { authProvider } from '../../firebase'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles({
    container: {
        background: COLORS.ADMIN_BACKGROUND_LIGHT,
        minHeight: '100vh',
        overflow: 'hidden',
    },
    newProjectContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        overflow: 'hidden',
    },
})

const AdminRoot = () => {
    const classes = useStyles()
    const inviteId = useQuery().get('inviteId')
    const dispatch = useDispatch()
    const projects = useSelector(getSortedProjectsSelector)
    const isUserValid = useSelector(isUserValidSelector)
    const isProjectsLoaded = useSelector(isProjectsLoadedSelector)
    const [isNewProjectOpen, setNewProjectOpen] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        authProvider.currentUser
            .getIdToken(true)
            .then(() => dispatch(getProjects()))
    }, [dispatch, isUserValid])

    return (
        <div style={{ position: 'relative' }}>
            <Box
                className={classes.container}
                style={{ height: isNewProjectOpen ? '100vh' : 'auto' }}>
                <RootHeader />
                <RootContentLayout
                    title={
                        isUserValid
                            ? t('root.title')
                            : t('root.userNotVerified')
                    }>
                    {!isUserValid && <EmailNotVerified dispatch={dispatch} />}

                    {isUserValid && (
                        <ProjectList
                            projects={projects}
                            isProjectsLoaded={isProjectsLoaded}
                            onNewEventClick={() => setNewProjectOpen(true)}
                            onProjectSelected={projectId =>
                                dispatch(selectProject(projectId))
                            }
                        />
                    )}
                </RootContentLayout>
            </Box>

            <div className={classes.newProjectContainer}>
                <Slide
                    direction="left"
                    mountOnEnter={true}
                    unmountOnExit={true}
                    in={isNewProjectOpen}
                    timeout={500}>
                    <div>
                        <NewProject onCancel={() => setNewProjectOpen(false)} />
                    </div>
                </Slide>
            </div>

            {inviteId && <ProjectInviteDialog inviteId={inviteId} />}
        </div>
    )
}

export default AdminRoot
