import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { Link } from 'react-router-dom'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import { getSessionVotes, getUserVotes } from './dashboardActions'
import { getSessions } from '../../../core/sessions/sessionsActions'
import { getProject } from '../../../feedback/project/projectActions'
import { getProjectSelector } from '../../../feedback/project/projectSelectors'
import { Grid } from '@material-ui/core'
import { isSessionLoadedSelector } from '../../../core/sessions/sessionsSelectors'
import MostVotedSessions from './MostVotedSessions'
import VoteTimeline from './VoteTimeline'

class ProjectDashboard extends Component {
    componentDidMount() {
        this.props.getProject(this.props.selectedProjectId)
        this.props.getSessionVotes()
        this.props.getUserVotes()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (
            (!this.props.project && nextProps.project) ||
            this.props.project.id !== nextProps.project.id
        ) {
            this.props.getSessions()
        }
    }

    render() {
        const { project, match } = this.props

        if (!project) {
            return <LoaderMatchParent />
        }

        return (
            <Grid container spacing={16}>
                <Grid item xs={12}>
                    {project.name} Dashboard
                    <br />
                    <Link to={`${match.url}/edit`}>Edit</Link>
                </Grid>
                <Grid item xs={12} md={6}>
                    <MostVotedSessions />
                </Grid>
                <Grid item xs={12} md={6}>
                    <VoteTimeline />
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    project: getProjectSelector(state),
    isSessionsLoaded: isSessionLoadedSelector(state),
    selectedProjectId: getSelectedProjectIdSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        getProject: getProject,
        getSessionVotes: getSessionVotes,
        getUserVotes: getUserVotes,
        getSessions: getSessions
    }
)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectDashboard)
