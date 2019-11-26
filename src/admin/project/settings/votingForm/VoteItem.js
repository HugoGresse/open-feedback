import React from 'react'
import OFInput from '../../../baseComponents/OFInput'
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import OFListItem from '../../../baseComponents/layouts/OFListItem'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(theme => ({
    cell: {
        paddingRight: 12,
        [theme.breakpoints.down('sm')]: {
            paddingTop: 12,
            paddingRight: 0,
        },
    },
    buttonCell: {
        textAlign: 'right',
    },
}))

const VoteItem = ({
    item,
    onChange,
    onMoveUp,
    onMoveDown,
    onDelete,
    onEnterPressed,
}) => {
    const classes = useStyles()

    return (
        <OFListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Grid item xs={12} sm={8} className={classes.cell}>
                <OFInput
                    value={item.name}
                    onChange={event => onChange(event.target.value)}
                    autoFocus={!item.name}
                    onKeyPress={ev => {
                        if (ev.key === 'Enter') {
                            onEnterPressed && onEnterPressed()
                            ev.preventDefault()
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={4} className={classes.buttonCell}>
                <IconButton aria-label="move up" onClick={() => onMoveUp()}>
                    <ArrowUpIcon />
                </IconButton>

                <IconButton aria-label="move down" onClick={() => onMoveDown()}>
                    <ArrowDownIcon />
                </IconButton>

                <IconButton aria-label="delete" onClick={() => onDelete()}>
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </OFListItem>
    )
}

export default VoteItem
