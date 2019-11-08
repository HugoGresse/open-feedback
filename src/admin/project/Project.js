import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getSelectedProjectSelector} from './core/projectSelectors'
import {selectProject} from './core/projectActions'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'

const Project = ({children, match}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(selectProject(match.params.projectId))
    }, [dispatch, match.params.projectId])

    const selectedProject = useSelector(getSelectedProjectSelector)

    if (selectedProject) return children
    return <LoaderMatchParent/>
}
export default Project
