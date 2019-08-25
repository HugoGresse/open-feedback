import React from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import { withStyles } from '@material-ui/core'
import VoteItem from './VoteItem'
import { useDispatch, useSelector } from 'react-redux'
import { getBooleanVoteItemsSelector } from './votingFormSelectors'
import {
    onVoteItemAddBoolean,
    onVoteItemChange,
    onVoteItemDelete,
    onVoteItemMoveDown,
    onVoteItemMoveUp
} from './votingFormActions'

const styles = () => ({})

/**
 * TODO :
 * implement actions
 * implement comment option
 */
const VoteItemList = ({ classes }) => {
    const dispatch = useDispatch()
    const voteItems = useSelector(getBooleanVoteItemsSelector)

    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>Vote items</TableCell>
                    <TableCell align="right">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {voteItems.map(item => (
                    <VoteItem
                        key={item.id}
                        item={item}
                        onChange={newValue =>
                            dispatch(
                                onVoteItemChange({
                                    ...item,
                                    name: newValue
                                })
                            )
                        }
                        onMoveUp={() => dispatch(onVoteItemMoveUp(item))}
                        onMoveDown={() => dispatch(onVoteItemMoveDown(item))}
                        onDelete={() => dispatch(onVoteItemDelete(item))}
                    />
                ))}
                <TableRow>
                    <TableCell component="th" scope="row">
                        <IconButton
                            aria-label="new vote item"
                            onClick={() => dispatch(onVoteItemAddBoolean())}
                        >
                            <AddIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default withStyles(styles)(VoteItemList)
