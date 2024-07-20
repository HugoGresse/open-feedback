import React from 'react'
import { useDispatch } from 'react-redux'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import { grey } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import TalksItem from './TalksItem.jsx'
import { setSelectedTalk } from '../talk/core/talkActions'

const useStyles = makeStyles(theme => ({
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

const SearchExtendedMatch = ({ talks, userTalkVote }) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const dispatch = useDispatch()

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
                        onClick={talk => dispatch(setSelectedTalk(talk.id))}
                    />
                ))}
            </Grid>
        </Box>
    )
}

export default SearchExtendedMatch
