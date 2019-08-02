import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import { getMostVotedSessionSelector } from './dashboardSelectors'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Paper from '@material-ui/core/Paper'
import Title from '../../../baseComponents/design/Title'

class MostVotedSessions extends Component {
    render() {
        const { mostVotedSessions } = this.props

        if (!mostVotedSessions) {
            return <LoaderMatchParent />
        }

        return (
            <Paper>
                <Title>Most Voted sessions</Title>
                {mostVotedSessions.length > 0 && (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Session</TableCell>
                                <TableCell align="right">Votes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mostVotedSessions.map(row => (
                                <TableRow key={row.sessionId}>
                                    <TableCell component="th" scope="row">
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
        )
    }
}

const mapStateToProps = state => ({
    mostVotedSessions: getMostVotedSessionSelector(state)
})

export default connect(
    mapStateToProps,
    {}
)(MostVotedSessions)
