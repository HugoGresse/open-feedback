import React, { Component } from 'react'
import styled from 'styled-components'
import Box from '../baseComponents/design/Box'
import { connect } from 'react-redux'
import { getProjectsSelector } from './projectCore/projectSelectors'
import { Link } from 'react-router-dom'

const Wrapper = styled(Box)`
    height: 100vh;
    padding: 15px;
    display: flex;
`

class ProjectDashboard extends Component {
    render() {
        const { match } = this.props
        return (
            <Wrapper>
                Dashboard
                <br />
                Stats will be displayed here
                <Link to={`${match.url}/edit`}>Edit</Link>
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
)(ProjectDashboard)
