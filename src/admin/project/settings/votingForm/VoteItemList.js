import React from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import VoteItem from './VoteItem'
import { withStyles } from '@material-ui/core'

const styles = () => ({})

/**
 * TODO :
 * load voteitems
 * implement actions
 * implement comment option
 */
function VoteItemList({ classes }) {
    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>Vote items</TableCell>
                    <TableCell align="right">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <VoteItem />
                <VoteItem />
            </TableBody>
        </Table>
    )
}

export default withStyles(styles)(VoteItemList)
