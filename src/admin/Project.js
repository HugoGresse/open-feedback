import React, { Component } from 'react'
import styled from 'styled-components'
import Box from '../baseComponents/design/Box'
import { connect } from 'react-redux'
import { getSelectedProjectSelector } from './project/projectSelectors'
import { selectProject } from './project/projectActions'

const Wrapper = styled(Box)`
    height: 100vh;
    padding: 15px;
    display: flex;
`

class Project extends Component {
    componentWillMount() {
        this.props.selectProject(this.props.match.params.projectId)
    }

    render() {
        const { project } = this.props

        if (!project) {
            return ''
        }

        return <Wrapper>{project.name}</Wrapper>
    }
}

const mapStateToProps = state => ({
    project: getSelectedProjectSelector(state)
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
