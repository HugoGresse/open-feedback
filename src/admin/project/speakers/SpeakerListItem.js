import React from 'react'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import OFListItem from '../../baseComponents/layouts/OFListItem'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Avatar from '@material-ui/core/Avatar'
import { Box } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
    cell: {
        paddingRight: 12,
        [theme.breakpoints.down('sm')]: {
            paddingTop: 12,
        },
    },
    buttonCell: {
        textAlign: 'right',
    },
}))

const SpeakerListItem = ({ speaker, onEdit, onRemove }) => {
    const classes = useStyles()

    return (
        <OFListItem>
            <Grid
                item
                xs={12}
                sm={10}
                className={classes.cell}
                component={Box}
                display="flex">
                <Avatar
                    alt={speaker.name}
                    src={speaker.photoUrl}
                    style={{ marginRight: 12, marginTop: 2 }}
                />
                <Typography style={{ fontWeight: 600, lineHeight: '40px' }}>
                    {speaker.name}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={2} className={classes.buttonCell}>
                <IconButton aria-label="edit" onClick={() => onEdit(speaker)}>
                    <EditIcon />
                </IconButton>

                <IconButton
                    aria-label="delete"
                    onClick={() => onRemove(speaker)}>
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </OFListItem>
    )
}

export default SpeakerListItem
