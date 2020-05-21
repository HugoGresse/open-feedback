import React, { useEffect } from 'react'

import Header from './layout/Header'
import '../App.css'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { setFavicon } from '../utils/dom'
import {
    getProjectLoadErrorSelector,
    getProjectSelector,
    getProjectVotesErrorSelector,
    isProjectNotFoundSelector,
} from './project/projectSelectors'
import Error from '../baseComponents/customComponent/Error'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent'
import { getLoginErrorSelector, isLoggedSelector } from './auth/authSelectors'
import Footer from './layout/Footer'
import { getTalksDatesSelector } from '../core/talks/talksSelectors'
import HardRedirect from '../baseComponents/HardRedirect'
import { getProject } from './project/projectActions'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { signIn } from './auth/authActions'
import { getVotes } from './vote/voteActions'
import { useTranslation } from 'react-i18next'
import { TALK_NO_DATE } from '../core/talks/talksUtils'

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.pageBackground,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: 1,
    },
    loading: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    layout: {
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        boxSizing: 'border-box',
        [theme.breakpoints.up(900 + theme.spacing(6))]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    },
}))

const AppLayout = ({ children }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
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
            history.replace(`/${projectId}/${talkDates[0]}`)
        }
    }, [routerParams, talkDates, history])

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
    } else if (!project) {
        return <LoaderMatchParent />
    } else {
        return (
            <div className={classes.container}>
                <div className={classes.content}>
                    <Header project={project} />

                    <div className={classes.layout}> {children}</div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default AppLayout
