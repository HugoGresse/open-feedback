import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
    isProjectsLoadedSelector,
} from './core/projectSelectors'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent.tsx'
import Layout404 from '../baseComponents/Layout404.jsx'
import {
    selectProject,
    unselectProject,
} from './core/actions/selectUnselectProject'

const Project = ({ children, urlProjectId }) => {
    const dispatch = useDispatch()
    const projectId = useSelector(getSelectedProjectIdSelector)

    useEffect(() => {
        dispatch(selectProject(urlProjectId))
        return () => {
            dispatch(unselectProject(null))
        }
    }, [dispatch, urlProjectId])

    const selectedProject = useSelector(getSelectedProjectSelector)
    const isProjectsLoaded = useSelector(isProjectsLoadedSelector)

    if (urlProjectId !== projectId) {
        // As the Project key is changing from the url, there is a time where the children are rerendered uselssly
        // causing action to be rerendered. This help synchronizing the url and the redux state on project switch.
        return <LoaderMatchParent />
    }

    if (selectedProject) return children
    if (isProjectsLoaded && !selectedProject) return <Layout404 />
    return <LoaderMatchParent />
}
export default Project
