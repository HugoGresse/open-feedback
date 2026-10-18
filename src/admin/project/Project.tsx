import { useEffect, type ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
    isProjectsLoadedSelector,
} from './core/projectSelectors'
import { LoaderMatchParent } from '../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { Layout404 } from '../baseComponents/Layout404.tsx'
import {
    selectProject,
    unselectProject,
} from './core/actions/selectUnselectProject'

interface ProjectProps {
    children?: ReactNode
    urlProjectId: string
}

export const Project = ({ children, urlProjectId }: ProjectProps) => {
    const dispatch = useAppDispatch()
    const projectId = useAppSelector(getSelectedProjectIdSelector)

    useEffect(() => {
        dispatch(selectProject(urlProjectId))
        return () => {
            dispatch(unselectProject())
        }
    }, [dispatch, urlProjectId])

    const selectedProject = useAppSelector(getSelectedProjectSelector)
    const isProjectsLoaded = useAppSelector(isProjectsLoadedSelector)

    if (urlProjectId !== projectId) {
        // As the Project key is changing from the url, there is a time where the children are rerendered uselssly
        // causing action to be rerendered. This help synchronizing the url and the redux state on project switch.
        return <LoaderMatchParent />
    }

    if (selectedProject) return children
    if (isProjectsLoaded && !selectedProject) return <Layout404 />
    return <LoaderMatchParent />
}
