import React, { Component } from 'react'
import {
    getSortedProjectsSelector,
    isProjectsLoadedSelector
} from './project/core/projectSelectors'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent'

class AdminRoot extends Component {
    render() {
        const { projects, isProjectsLoaded, match } = this.props

        if (isProjectsLoaded) {
            if (projects.length > 0) {
                const rootUrl = match.url.endsWith('/')
                    ? match.url
                    : match.url + '/'
                return <Redirect to={`${rootUrl}${projects[0].id}/dashboard`} />
            }
            return <div>TODO : create new project button</div>
        }
        return <LoaderMatchParent />
    }
}

const mapStateToProps = state => ({
    projects: getSortedProjectsSelector(state),
    isProjectsLoaded: isProjectsLoadedSelector(state)
})

const mapDispatchToProps = Object.assign({}, {})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminRoot)
