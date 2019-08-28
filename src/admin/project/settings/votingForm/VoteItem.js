import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import OFInput from '../../../baseComponents/OFInput'
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

const VoteItem = ({ item, onChange, onMoveUp, onMoveDown, onDelete }) => {
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                <OFInput
                    value={item.name}
                    onChange={event => onChange(event.target.value)}
                />
            </TableCell>
            <TableCell align="right">
                <IconButton aria-label="move up" onClick={() => onMoveUp()}>
                    <ArrowUpIcon />
                </IconButton>

                <IconButton aria-label="move down" onClick={() => onMoveDown()}>
                    <ArrowDownIcon />
                </IconButton>

                <IconButton aria-label="move down" onClick={() => onDelete()}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}

export default VoteItem
