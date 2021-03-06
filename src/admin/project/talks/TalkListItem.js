import React from 'react'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import RoomIcon from '@material-ui/icons/Room'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import OFListItem from '../../baseComponents/layouts/OFListItem'
import TalkListItemSpeakerList from './TalkListItemSpeakerList'
import Chip from '@material-ui/core/Chip'
import { DateTime } from 'luxon'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
    cell: {
        paddingRight: 12,
        [theme.breakpoints.down('sm')]: {
            paddingTop: 12,
        },
    },
    buttonCell: {
        textAlign: 'right',
    },
    title: {
        fontWeight: 'bold',
        wordBreak: 'break-word',
    },
}))

const TalkListItem = ({
    item,
    speakers,
    onEdit,
    onRemove,
    onSpeakerClicked,
}) => {
    const classes = useStyles()

    return (
        <OFListItem>
            <Grid item xs={12} sm={4} lg={6} className={classes.cell}>
                <Typography className={classes.title}>{item.title}</Typography>
            </Grid>
            <Grid item xs={12} sm={4} lg={2} className={classes.cell}>
                <TalkListItemSpeakerList
                    speakersIds={item.speakers}
                    speakers={speakers}
                    onSpeakerClicked={onSpeakerClicked}
                />
            </Grid>
            <Grid item xs={12} sm={2} lg={2} className={classes.cell}>
                {item.trackTitle && (
                    <Chip
                        icon={<RoomIcon />}
                        size="small"
                        label={item.trackTitle}
                        style={{
                            marginBottom: item.startTime ? 5 : 0,
                            marginRight: 5,
                        }}
                        variant="outlined"
                    />
                )}
                {item.startTime && (
                    <Chip
                        icon={<CalendarIcon />}
                        size="small"
                        label={DateTime.fromISO(
                            item.startTime
                        ).toLocaleString()}
                        style={{ marginBottom: item.startTime ? 5 : 0 }}
                        variant="outlined"
                    />
                )}
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
