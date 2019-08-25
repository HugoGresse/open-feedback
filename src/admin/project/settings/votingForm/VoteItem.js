import React, { Component } from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import OFInput from '../../../baseComponents/OFInput'
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

class VoteItem extends Component {
    render() {
        return (
            <TableRow>
                <TableCell component="th" scope="row">
                    <OFInput />
                </TableCell>
                <TableCell align="right">
                    <IconButton aria-label="move up">
                        <ArrowUpIcon />
                    </IconButton>

                    <IconButton aria-label="move down">
                        <ArrowDownIcon />
                    </IconButton>

                    <IconButton aria-label="move down">
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        )
    }
}

export default VoteItem
