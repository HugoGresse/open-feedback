import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSelectedProjectIdSelector } from './core/projectSelectors'
import { Link } from 'react-router-dom'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import { getSessionVotes } from './dashboard/dashboardActions'
import { getMostVotedSessionSelector } from './dashboard/dashboardSelectors'
import { getSessions } from '../../core/sessions/sessionsActions'
import { getProject } from '../../feedback/project/projectActions'
import { getProjectSelector } from '../../feedback/project/projectSelectors'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import { Grid } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Title from '../../baseComponents/design/Title'
import { isSessionLoadedSelector } from '../../core/sessions/sessionsSelectors'

class ProjectDashboard extends Component {
    componentDidMount() {
        this.props.getProject(this.props.selectedProjectId)
        this.props.getSessionVotes()
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
        const { project, match, mostVotedSessions } = this.props

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
                    <Paper>
                        <Title>Most Voted sessions</Title>
                        {mostVotedSessions.length > 0 && (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Session</TableCell>
                                        <TableCell align="right">
                                            Votes
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mostVotedSessions.map(row => (
                                        <TableRow key={row.sessionId}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {row.title}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.voteCount}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    project: getProjectSelector(state),
    isSessionsLoaded: isSessionLoadedSelector(state),
    mostVotedSessions: getMostVotedSessionSelector(state),
    selectedProjectId: getSelectedProjectIdSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        getProject: getProject,
        getSessionVotes: getSessionVotes,
        getSessions: getSessions
    }
)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectDashboard)
