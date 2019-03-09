import React, { Component } from 'react'
import SideBar from './auth/SideBar'
import Box from '../baseComponents/design/Box'

class AdminLayout extends Component {
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

export default AdminLayout
