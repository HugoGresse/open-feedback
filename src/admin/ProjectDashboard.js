import React, { Component } from 'react'
import styled from 'styled-components'
import Box from '../baseComponents/design/Box'
import { connect } from 'react-redux'
import { getSelectedProjectSelector } from './projectCore/projectSelectors'
import { Link } from 'react-router-dom'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent'
import { getProjects } from './projectCore/projectActions'

const Wrapper = styled(Box)`
    height: 100vh;
    padding: 15px;
    display: flex;
`

class ProjectDashboard extends Component {
    componentWillMount() {
        this.props.getProjects()
    }

    render() {
        const { project, match } = this.props

        if (!project) {
            return <LoaderMatchParent />
        }

        return (
            <Wrapper>
                {project.name} Dashboard
                <br />
                Stats will be displayed here
                <Link to={`${match.url}/edit`}>Edit</Link>
            </Wrapper>
        )
    }
}

const mapStateToProps = state => ({
    project: getSelectedProjectSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        getProjects: getProjects
    }
)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectDashboard)
