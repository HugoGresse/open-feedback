import React from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import { withStyles } from '@material-ui/core'
import VoteItem from './VoteItem'
import { useDispatch, useSelector } from 'react-redux'
import { getBooleanVoteItemsSelector, isSavingSelector } from './votingFormSelectors'
import {
    onVoteItemAddBoolean,
    onVoteItemChange,
    onVoteItemDelete,
    onVoteItemMoveDown,
    onVoteItemMoveUp,
    saveVoteItems
} from './votingFormActions'
import Button from '@material-ui/core/Button'
import OFButton from '../../../baseComponents/OFButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'

const styles = () => ({
    icon: {
        marginRight: 6
    },
    progress: {
        width: 30,
        height: 30,
        marginRight: 10,
        top: 10,
        position: 'relative'
    }
})

const VoteItemList = ({ classes }) => {
    const dispatch = useDispatch()
    const voteItems = useSelector(getBooleanVoteItemsSelector)
    const isSaving = useSelector(isSavingSelector)

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Vote items</TableCell>
                    <TableCell align="right">
                        <Fade in={isSaving}>
                            <CircularProgress
                                size={30}
                                className={classes.progress}
                            />
                        </Fade>

                        <OFButton onClick={() => dispatch(saveVoteItems())}>
                            Save
                        </OFButton>
                    </TableCell>
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
                        <Button
                            aria-label="new vote item"
                            onClick={() => dispatch(onVoteItemAddBoolean())}
                        >
                            <AddIcon className={classes.icon} />
                            New item
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default withStyles(styles)(VoteItemList)
