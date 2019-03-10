import React, { Component } from 'react'
import styled from 'styled-components'
import Box from '../baseComponents/design/Box'
import { connect } from 'react-redux'
import { getProjectsSelector } from './project/projectSelectors'

const Wrapper = styled(Box)`
    height: 100vh;
    padding: 15px;
    display: flex;
`

class Dashboard extends Component {
    render() {
        const { projects } = this.props
        return (
            <Wrapper>
                Dashboard
                <br />
                You have {projects.length} project(s).
            </Wrapper>
        )
    }
}

const mapStateToProps = state => ({
    projects: getProjectsSelector(state)
})

const mapDispatchToProps = Object.assign({}, {})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard)
