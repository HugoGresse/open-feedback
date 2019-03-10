import React, { Component } from 'react'
import SideBar from './SideBar'
import Box from '../baseComponents/design/Box'
import { connect } from 'react-redux'
import { getProjects } from './project/projectActions'

class AdminLayout extends Component {
    componentWillMount() {
        this.props.getProjects()
    }

    render() {
        return (
            <Box
                flex
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                flexGrow="1"
                textAlign="center"
            >
                <SideBar match={this.props.match} />
                <Box flexGrow="1">{this.props.children}</Box>
            </Box>
        )
    }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = Object.assign(
    {},
    {
        getProjects: getProjects
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminLayout)
