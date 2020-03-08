import React, { useEffect } from 'react'

import Header from './layout/Header'
import '../App.css'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { setFavicon } from './layout/utils'
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

const useStyles = makeStyles(theme => ({
    container: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
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
        if (!date && talkDates.length > 0) {
            history.replace(`/${projectId}/${talkDates[0]}`)
        }
    }, [routerParams, talkDates, history])

    if (loginError) {
        return (
            <Error
                error="Fail to anonymously login you."
                errorDetail={loginError}
            />
        )
    } else if (projectLoadError) {
        return (
            <Error
                error="Unable to load the project."
                errorDetail={projectLoadError}
            />
        )
    } else if (projectNotFound) {
        return <HardRedirect to="/404" />
    } else if (projectVotesError) {
        return (
            <Error
                error="Unable to load the votes and/or the vote options."
                errorDetail={projectVotesError}
            />
        )
    } else if (!project) {
        return <LoaderMatchParent />
    } else {
        return (
            <div className={classes.container}>
                <Header project={project} />

                <div className={classes.layout}> {children}</div>
                <Footer />
            </div>
        )
    }
}

export default AppLayout
