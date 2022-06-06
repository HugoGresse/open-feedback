import React from 'react'
import Box from '@material-ui/core/Box'
import { DateTime } from 'luxon'
import SpeakerList from '../speaker/SpeakerList'
import { useTheme } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useQuery from '../../utils/useQuery'

const formatTalkDateTime = (talk) => {
    const startDate = DateTime.fromISO(talk.startTime, {
        setZone: true,
    }).toLocaleString({
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    })

    const startTime = DateTime.fromISO(talk.startTime, { setZone: true })
        .setZone('local', { keepLocalTime: true })
        .toLocaleString(DateTime.TIME_SIMPLE)

    const endTime = DateTime.fromISO(talk.endTime, {
        setZone: true,
    }).toLocaleString(DateTime.TIME_SIMPLE)

    return `${startDate} / ${startTime} - ${endTime}`
}

const useStyles = makeStyles(() => ({
    title: {
        wordBreak: 'break-word',
    },
}))

const TalkHeader = ({ talk, speakers }) => {
    const classes = useStyles()
    const theme = useTheme()
    const hideHeader = useQuery().get('hideHeader')

    if (hideHeader && hideHeader === 'true') {
        return <Box height={2}></Box>
    }

    return (
        <Box marginBottom={4}>
            <Typography
                variant="h2"
                color="textPrimary"
                className={classes.title}
            >
                {talk.title}
                <Box
                    color={theme.palette.textDimmed}
                    fontSize={20}
                    marginLeft={1}
                    component="span"
                >
                    {talk.tags &&
                        talk.tags.map((tag, key) => (
                            <span key={key}>#{tag} </span>
                        ))}
                </Box>
            </Typography>
            <Box
                fontSize={16}
                color={theme.palette.textDimmed}
                marginBottom={2}
            >
                {talk.startTime && formatTalkDateTime(talk)}
            </Box>
            <SpeakerList speakers={speakers} />
        </Box>
    )
}

export default TalkHeader
