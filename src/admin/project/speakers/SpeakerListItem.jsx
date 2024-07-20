import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import OFListItem from '../../baseComponents/layouts/OFListItem.jsx'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import Avatar from '@mui/material/Avatar'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles(theme => ({
    cell: {
        paddingRight: 12,
        [theme.breakpoints.down('xl')]: {
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
                <IconButton aria-label="edit" onClick={() => onEdit(speaker)} size="large">
                    <EditIcon />
                </IconButton>

                <IconButton aria-label="delete" onClick={() => onRemove(speaker)} size="large">
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </OFListItem>
    );
}

export default SpeakerListItem
