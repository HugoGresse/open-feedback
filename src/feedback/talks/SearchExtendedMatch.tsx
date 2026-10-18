import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import type { Theme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import { TalksItem } from './TalksItem.tsx'
import type { Talk, Vote } from '../../core/models'

interface SearchExtendedMatchProps {
    talks: Talk[]
    /** The user votes keyed by talk id. */
    userTalkVote: Record<string, Vote>
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        padding: 16,
        borderRadius: 4,
        marginTop: 32,
        backgroundColor:
            theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : grey[100],
    },
    talks: {
        transform: 'scale(0.9)',
    },
}))

export const SearchExtendedMatch = ({
    talks,
    userTalkVote,
}: SearchExtendedMatchProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    if (talks.length === 0) {
        return null
    }

    return (
        <Box className={classes.container}>
            {
                <Typography color="textPrimary">
                    {t('searchExtendedMatch')}
                </Typography>
            }

            <Grid container spacing={2} className={classes.talks}>
                {talks.map((talk, key) => (
                    <TalksItem
                        key={key}
                        talk={talk}
                        userVote={userTalkVote[talk.id]}
                    />
                ))}
            </Grid>
        </Box>
    )
}
