import React from 'react'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import { getDateFromStartTime } from '../../../core/sessions/sessionsUtils'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import OFListItem from '../../baseComponents/layouts/OFListItem'

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

const TalkListItem = ({ item, speakers, onEdit, onRemove }) => {
    const classes = useStyles()

    return (
        <OFListItem>
            <Grid item xs={12} sm={4} lg={6} className={classes.cell}>
                <b>{item.title}</b>
            </Grid>
            <Grid item xs={12} sm={3} lg={2} className={classes.cell}>
                {speakers.map(speaker => speaker && speaker.name + ' \n')}
            </Grid>
            <Grid item xs={12} sm={3} lg={2} className={classes.cell}>
                {item.trackTitle}
                <br />
                {getDateFromStartTime(item.startTime)}
            </Grid>
            <Grid item xs={12} sm={2} lg={2} className={classes.buttonCell}>
                <IconButton aria-label="edit" onClick={() => onEdit(item)}>
                    <EditIcon />
                </IconButton>

                <IconButton aria-label="delete" onClick={() => onRemove(item)}>
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </OFListItem>
    )
}

export default TalkListItem
