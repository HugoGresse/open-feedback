import React, { Component } from 'react'
import {
    getProjectsSelector,
    isProjectsLoadedSelector
} from './project/core/projectSelectors'
import { connect } from 'react-redux'
import Redirect from 'react-router-dom/Redirect'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent'

class AdminRoot extends Component {
    render() {
        const { projects, isProjectsLoaded, match } = this.props

        if (isProjectsLoaded) {
            if (projects.length > 0) {
                return <Redirect to={`${match.url}/${projects[0].id}`} />
            }
            return <div>TODO : create new project button</div>
        }
        return <LoaderMatchParent />
    }
}

const mapStateToProps = state => ({
    projects: getProjectsSelector(state),
    isProjectsLoaded: isProjectsLoadedSelector(state)
})

const mapDispatchToProps = Object.assign({}, {})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminRoot)
