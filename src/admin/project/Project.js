import { useEffect } from 'react'
import { connect } from 'react-redux'
import {
    getSelectedProjectIdSelector,
    getSortedProjectsSelector
} from './core/projectSelectors'
import { selectProject } from './core/projectActions'

/**
 * @return {string}
 */
function Project({ selectProject, selectedProjectId, children, match }) {
    console.log('First render, selected: ' + selectedProjectId)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => selectProject(match.params.projectId), [])

    if (selectedProjectId) return children
    return 'Loading...'
}

const mapStateToProps = state => ({
    projects: getSortedProjectsSelector(state),
    selectedProjectId: getSelectedProjectIdSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        selectProject: selectProject
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Project)
