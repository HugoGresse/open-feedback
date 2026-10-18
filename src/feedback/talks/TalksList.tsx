import { TalksItem } from './TalksItem.tsx'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import type { Talk, Vote } from '../../core/models'

const useStyles = makeStyles(() => ({
    track: {
        marginTop: 40,
        marginBottom: 30,
    },
}))

/** Talks of one track. */
export interface TrackTalks {
    track: string
    talks: Talk[]
}

interface TalksListProps {
    talks: TrackTalks[]
    /** The user votes keyed by talk id. */
    userTalkVote: Record<string, Vote>
}

export const TalksList = ({ talks, userTalkVote }: TalksListProps) => {
    const classes = useStyles()

    return talks.map((track, key) => (
        <div key={key}>
            <Typography
                color="textPrimary"
                component="h2"
                variant="h3"
                className={classes.track}
            >
                {track.track}
            </Typography>

            <Grid container spacing={2}>
                {track.talks.map((talk, key) => (
                    <TalksItem
                        key={key}
                        talk={talk}
                        userVote={userTalkVote[talk.id]}
                    />
                ))}
            </Grid>
        </div>
    ))
}
