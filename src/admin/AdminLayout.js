import React, { Component } from 'react'
import SideBar from './project/layout/SideBar'
import Box from '../baseComponents/design/Box'
import { connect } from 'react-redux'
import { getProjects } from './project/core/projectActions'
import { Grid } from '@material-ui/core'
import Header from './project/layout/Header'

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
                <Box flexGrow="1">
                    <Grid container>
                        <Grid item xs={12}>
                            <Header />
                        </Grid>
                        <Grid item xs={12}>
                            {this.props.children}
                        </Grid>
                    </Grid>
                </Box>
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
