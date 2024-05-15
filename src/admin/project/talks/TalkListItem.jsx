import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RoomIcon from '@mui/icons-material/Room'
import CalendarIcon from '@mui/icons-material/CalendarToday'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import OFListItem from '../../baseComponents/layouts/OFListItem.jsx'
import TalkListItemSpeakerList from './TalkListItemSpeakerList.jsx'
import Chip from '@mui/material/Chip'
import { DateTime } from 'luxon'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles((theme) => ({
    cell: {
        paddingRight: 12,
        [theme.breakpoints.down('xl')]: {
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
                            item.startTime,
                        ).toFormat("t, cccc d")}
                        style={{ marginBottom: item.startTime ? 5 : 0 }}
                        variant="outlined"
                    />
                )}
            </Grid>
            <Grid item xs={12} sm={2} lg={2} className={classes.buttonCell}>
                <IconButton aria-label="edit" onClick={() => onEdit(item)} size="large">
                    <EditIcon />
                </IconButton>

                <IconButton aria-label="delete" onClick={() => onRemove(item)} size="large">
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </OFListItem>
    )
}

export default TalkListItem
