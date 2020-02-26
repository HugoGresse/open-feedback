import React from 'react'
import OFInput from '../../../baseComponents/form/input/OFInput'
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import OFListItem from '../../../baseComponents/layouts/OFListItem'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { useTranslation } from 'react-i18next'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../../../core/contants'

const useStyles = makeStyles(theme => ({
    cell: {
        paddingRight: 12,
        [theme.breakpoints.down('sm')]: {
            paddingTop: 12,
            paddingRight: 0,
        },
    },
    typeCell: {
        [theme.breakpoints.down('sm')]: {
            paddingTop: 12,
        },
    },
    buttonCell: {
        textAlign: 'right',
    },
}))

const getTypes = t => [
    {
        type: VOTE_TYPE_BOOLEAN,
        name: t('settingsVotingForm.typeBoolean'),
    },
    {
        type: VOTE_TYPE_TEXT,
        name: t('settingsVotingForm.typeText'),
    },
]

const VoteItem = ({
    item,
    onChange,
    onMoveUp,
    onMoveDown,
    onDelete,
    onEnterPressed,
    onTypeChange,
}) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const types = getTypes(t)

    return (
        <OFListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Grid item xs={12} sm={6} className={classes.cell}>
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
            <Grid item xs={12} sm={2} className={classes.typeCell}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={item.type}
                    onChange={event => onTypeChange(event.target.value)}
                    input={<OFInput />}>
                    {types.map(type => (
                        <MenuItem key={type.type} value={type.type}>
                            {type.name}
                        </MenuItem>
                    ))}
                </Select>
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
