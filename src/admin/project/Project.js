import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
    isProjectsLoadedSelector,
} from './core/projectSelectors'
import { selectProject, unselectProject } from './core/projectActions'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import Layout404 from './layout/Layout404'

const Project = ({ children, match }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(selectProject(match.params.projectId))
        return () => {
            dispatch(unselectProject(null))
        }
    }, [dispatch, match.params.projectId])

    const selectedProject = useSelector(getSelectedProjectSelector)
    const selectedProject2 = useSelector(getSelectedProjectIdSelector)
    const isProjectsLoaded = useSelector(isProjectsLoadedSelector)

    console.log('selected', selectedProject2, selectedProject)
    if (selectedProject) return children
    if (isProjectsLoaded && !selectedProject) return <Layout404 />
    return <LoaderMatchParent />
}
export default Project
