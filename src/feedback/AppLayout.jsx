import React, { useEffect } from 'react'
import '../App.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setFavicon } from '../utils/dom'
import {
    getProjectLoadErrorSelector,
    getProjectSelector,
    getProjectVotesErrorSelector,
    isProjectNotFoundSelector,
} from './project/projectSelectors'
import Error from '../baseComponents/customComponent/Error.jsx'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent.jsx'
import { getLoginErrorSelector, isLoggedSelector } from './auth/authSelectors'
import { Footer } from './layout/Footer.jsx'
import { getTalksDatesSelector } from '../core/talks/talksSelectors'
import HardRedirect from '../baseComponents/HardRedirect.jsx'
import { getProject } from './project/projectActions'
import { signIn } from './auth/authActions'
import { getVotes } from './vote/voteActions'
import { useTranslation } from 'react-i18next'
import { TALK_NO_DATE } from '../core/talks/talksUtils'
import { Header } from './layout/Header.jsx'
import { styled, useTheme } from '@mui/material'
import Box from '@mui/material/Box'

const Layout = styled('main')((theme) => ({
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
    boxSizing: 'border-box',
    [theme.breakpoints.up(900 + theme.spacing(6))]: {
        width: 900,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    [theme.breakpoints.down('lg')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}))

const AppLayout = ({ children }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const routerParams = useParams()
    const { t } = useTranslation()
    const project = useSelector(getProjectSelector)
    const talkDates = useSelector(getTalksDatesSelector)

    const projectLoadError = useSelector(getProjectLoadErrorSelector)
    const projectNotFound = useSelector(isProjectNotFoundSelector)
    const projectVotesError = useSelector(getProjectVotesErrorSelector)
    const loginError = useSelector(getLoginErrorSelector)
    const isLoggedIn = useSelector(isLoggedSelector)

    useEffect(() => {
        if (isLoggedIn && project) {
            dispatch(getVotes())
        }
    }, [dispatch, isLoggedIn, project])

    useEffect(() => {
        if (!project) {
            dispatch(getProject(routerParams.projectId))
        } else {
            document.title = project.name + ' - Feedback'
            setFavicon(project.favicon)
            dispatch(signIn())
        }
    }, [routerParams.projectId, project, dispatch])

    useEffect(() => {
        const { date, projectId } = routerParams
        if (
            !date &&
            talkDates.length > 0 &&
            !talkDates.includes(TALK_NO_DATE)
        ) {
            navigate(`/${projectId}/${talkDates[0]}`)
        }
    }, [routerParams, talkDates, navigate])

    if (loginError) {
        return (
            <Error error={t('auth.errorLogin')} errorDetail={t(loginError)} />
        )
    } else if (projectLoadError) {
        return (
            <Error
                error={t('project.errorLoad')}
                errorDetail={projectLoadError}
            />
        )
    } else if (projectNotFound) {
        return <HardRedirect to="/404" />
    } else if (projectVotesError) {
        return (
            <Error
                error={t('project.errorLoadVotes')}
                errorDetail={projectVotesError}
            />
        )
    } else {
        return (
            <Box backgroundColor={theme.color.pageBackground} minHeight="100vh" display="flex" flexDirection="column">
                {project ? (
                    <Box flex={1}>
                        <Header project={project} />

                        <Layout> {children}</Layout>
                    </Box>
                ) : (
                    <LoaderMatchParent height="90vh" />
                )}
                <Footer />
            </Box>
        )
    }
}

export default AppLayout
