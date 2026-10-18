import EditIcon from '@mui/icons-material/Edit'
import RoomIcon from '@mui/icons-material/Room'
import CalendarIcon from '@mui/icons-material/CalendarToday'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import { OFListItem } from '../../baseComponents/layouts/OFListItem.tsx'
import { TalkListItemSpeakerList } from './TalkListItemSpeakerList.tsx'
import Chip from '@mui/material/Chip'
import { DateTime } from 'luxon'
import Typography from '@mui/material/Typography'
import { DeleteTalkButton } from './DeleteTalkButton.tsx'
import type { Theme } from '@mui/material/styles'
import type { SpeakersMap, Talk } from '../../../core/models'

const useStyles = makeStyles((theme: Theme) => ({
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

export interface TalkListItemProps {
    item: Talk
    speakers: SpeakersMap
    onEdit: (talk: Talk) => void
    /** Returns true when the removal must not happen (e.g. read-only project). */
    isRemoveBlocked: () => boolean
    onSpeakerClicked: (speakerName: string) => void
}

export const TalkListItem = ({
    item,
    speakers,
    onEdit,
    isRemoveBlocked,
    onSpeakerClicked,
}: TalkListItemProps) => {
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
                        label={DateTime.fromISO(item.startTime).toFormat(
                            't, cccc d'
                        )}
                        style={{ marginBottom: item.startTime ? 5 : 0 }}
                        variant="outlined"
                    />
                )}
            </Grid>
            <Grid item xs={12} sm={2} lg={2} className={classes.buttonCell}>
                <IconButton
                    aria-label="edit"
                    onClick={() => onEdit(item)}
                    size="large"
                >
                    <EditIcon />
                </IconButton>

                <DeleteTalkButton talk={item} isBlocked={isRemoveBlocked} />
            </Grid>
        </OFListItem>
    )
}
